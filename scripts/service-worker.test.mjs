import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import vm from "node:vm";

const projectRoot = path.resolve(import.meta.dirname, "..");
const workerPath = path.join(projectRoot, "public/sw.js");
const workerSource = fs.readFileSync(workerPath, "utf8");

function cacheKey(request) {
  return typeof request === "string" ? request : request.url;
}

function scopedCacheName(scope, version = "v6") {
  const pathname = new URL(scope).pathname.replace(/\/{2,}/gu, "/").replace(/\/?$/u, "/");
  return `astro-blog:${encodeURIComponent(pathname)}:${version}`;
}

function createWorker({
  scope = "https://example.com/example-blog/",
  fetchImpl = async () => new Response("network"),
  cacheNames = [],
  sharedStores,
  entries = []
} = {}) {
  const listeners = new Map();
  const stores = sharedStores ?? new Map();
  for (const name of cacheNames) {
    if (!stores.has(name)) stores.set(name, new Map());
  }
  const calls = {
    added: [],
    claimed: 0,
    deleted: [],
    fetched: [],
    matched: [],
    opened: [],
    put: [],
    skippedWaiting: 0
  };

  for (const [name, key, response] of entries) {
    if (!stores.has(name)) stores.set(name, new Map());
    stores.get(name).set(key, response);
  }

  const caches = {
    async delete(name) {
      calls.deleted.push(name);
      return stores.delete(name);
    },
    async keys() {
      return [...stores.keys()];
    },
    async open(name) {
      calls.opened.push(name);
      if (!stores.has(name)) stores.set(name, new Map());
      const store = stores.get(name);
      return {
        async add(request) {
          calls.added.push(request);
        },
        async match(request) {
          const key = cacheKey(request);
          calls.matched.push(key);
          return store.get(key);
        },
        async put(request, response) {
          const key = cacheKey(request);
          calls.put.push(key);
          store.set(key, response);
        }
      };
    }
  };

  const self = {
    addEventListener(type, listener) {
      listeners.set(type, listener);
    },
    clients: {
      async claim() {
        calls.claimed += 1;
      }
    },
    registration: { scope },
    skipWaiting() {
      calls.skippedWaiting += 1;
    }
  };

  const context = {
    caches,
    fetch: async (...args) => {
      calls.fetched.push(args);
      return fetchImpl(...args);
    },
    location: new URL(scope),
    Request,
    Response,
    self,
    URL
  };
  vm.runInNewContext(workerSource, context, { filename: workerPath });

  async function dispatch(type, request) {
    const waits = [];
    let responsePromise;
    const event = {
      request,
      respondWith(value) {
        responsePromise = Promise.resolve(value);
      },
      waitUntil(value) {
        waits.push(Promise.resolve(value));
      }
    };

    listeners.get(type)(event);
    const response = responsePromise ? await Promise.resolve(responsePromise) : undefined;
    await Promise.all(waits);
    return { handled: responsePromise !== undefined, response };
  }

  return { calls, dispatch, stores };
}

test("precache and cleanup stay inside the service worker scope and cache namespace", async () => {
  const scope = "https://example.com/example-blog/";
  const currentCache = scopedCacheName(scope);
  const previousCache = scopedCacheName(scope, "v5");
  const worker = createWorker({
    scope,
    cacheNames: [previousCache, currentCache, "astro-blog-v5", "another-app-v2"]
  });

  await worker.dispatch("install");
  assert.equal(worker.calls.skippedWaiting, 1);
  assert.equal(worker.calls.added.length, 1);
  assert.equal(worker.calls.added[0].url, "https://example.com/example-blog/404.html");
  assert.equal(worker.calls.added[0].cache, "no-store");

  await worker.dispatch("activate");
  assert.deepEqual(worker.calls.deleted, [previousCache, "astro-blog-v5"]);
  assert.equal(worker.calls.claimed, 1);
  assert.equal(worker.stores.has("another-app-v2"), true);
});

test("workers on the same origin never delete another scope's caches", async () => {
  const rootScope = "https://example.com/";
  const projectScope = "https://example.com/astro_blog_template/";
  const rootCurrent = scopedCacheName(rootScope);
  const rootPrevious = scopedCacheName(rootScope, "v5");
  const projectCurrent = scopedCacheName(projectScope);
  const projectPrevious = scopedCacheName(projectScope, "v5");
  const stores = new Map(
    [rootPrevious, projectPrevious, "astro-blog-v5", "another-app-v2"].map((name) => [
      name,
      new Map()
    ])
  );
  const rootWorker = createWorker({ scope: rootScope, sharedStores: stores });
  const projectWorker = createWorker({ scope: projectScope, sharedStores: stores });

  await rootWorker.dispatch("install");
  await projectWorker.dispatch("install");
  assert.equal(stores.has(rootCurrent), true);
  assert.equal(stores.has(projectCurrent), true);

  await rootWorker.dispatch("activate");
  assert.deepEqual(rootWorker.calls.deleted, [rootPrevious, "astro-blog-v5"]);
  assert.equal(stores.has(projectPrevious), true);
  assert.equal(stores.has(projectCurrent), true);
  assert.equal(stores.has("another-app-v2"), true);

  await projectWorker.dispatch("activate");
  assert.deepEqual(projectWorker.calls.deleted, [projectPrevious]);
  assert.equal(stores.has(rootCurrent), true);
  assert.equal(stores.has(projectCurrent), true);
  assert.equal(stores.has("another-app-v2"), true);
});

test("document and ClientRouter HTML requests bypass stale cached pages", async () => {
  const pageUrl = "https://example.com/example-blog/posts/fresh/";
  const cacheName = scopedCacheName("https://example.com/example-blog/");
  const worker = createWorker({
    entries: [
      [cacheName, pageUrl, new Response("<html>stale</html>")],
      [cacheName, "https://example.com/example-blog/404.html", new Response("<html>offline</html>")]
    ],
    fetchImpl: async () => new Response("<html>fresh</html>")
  });

  const clientRouterRequest = new Request(pageUrl, {
    headers: { accept: "text/html,application/xhtml+xml" }
  });
  const clientResult = await worker.dispatch("fetch", clientRouterRequest);
  assert.equal(clientResult.handled, true);
  assert.equal(await clientResult.response.text(), "<html>fresh</html>");
  assert.equal(worker.calls.fetched[0][1].cache, "no-store");
  assert.deepEqual(worker.calls.matched, []);
  assert.deepEqual(worker.calls.put, []);

  const documentRequest = {
    destination: "document",
    headers: new Headers(),
    method: "GET",
    mode: "same-origin",
    url: pageUrl
  };
  const documentResult = await worker.dispatch("fetch", documentRequest);
  assert.equal(await documentResult.response.text(), "<html>fresh</html>");
  assert.equal(worker.calls.fetched[1][1].cache, "no-store");
  assert.deepEqual(worker.calls.put, []);
});

test("network failure returns only the scoped offline fallback", async () => {
  const pageUrl = "https://example.com/example-blog/posts/old/";
  const fallbackUrl = "https://example.com/example-blog/404.html";
  const cacheName = scopedCacheName("https://example.com/example-blog/");
  const worker = createWorker({
    entries: [
      [cacheName, pageUrl, new Response("<html>stale page</html>")],
      [cacheName, fallbackUrl, new Response("<html>offline fallback</html>")]
    ],
    fetchImpl: async () => {
      throw new TypeError("offline");
    }
  });

  const result = await worker.dispatch(
    "fetch",
    new Request(pageUrl, { headers: { accept: "text/html" } })
  );

  assert.equal(await result.response.text(), "<html>offline fallback</html>");
  assert.deepEqual(worker.calls.matched, [fallbackUrl]);
  assert.deepEqual(worker.calls.put, []);
});

test("only content-hashed scoped Astro assets use cache-first", async () => {
  const cachedUrl = "https://example.com/example-blog/_astro/app.Abcdef12.js";
  const uncachedUrl = "https://example.com/example-blog/_astro/styles.Zyxwv987.css";
  const cacheName = scopedCacheName("https://example.com/example-blog/");
  const worker = createWorker({
    entries: [[cacheName, cachedUrl, new Response("cached asset")]],
    fetchImpl: async () => new Response("network asset")
  });

  const cachedResult = await worker.dispatch("fetch", new Request(cachedUrl));
  assert.equal(await cachedResult.response.text(), "cached asset");
  assert.equal(worker.calls.fetched.length, 0);

  const uncachedResult = await worker.dispatch("fetch", new Request(uncachedUrl));
  assert.equal(await uncachedResult.response.text(), "network asset");
  assert.deepEqual(worker.calls.put, [uncachedUrl]);

  for (const url of [
    "https://example.com/example-blog/_astro/unhashed.js",
    "https://example.com/example-blog/images/banner.webp",
    "https://example.com/example-blog/manifest.webmanifest",
    "https://example.com/another-site/_astro/app.Abcdef12.js"
  ]) {
    const result = await worker.dispatch("fetch", new Request(url));
    assert.equal(result.handled, false, `${url} should use the browser HTTP cache`);
  }
  assert.equal(worker.calls.fetched.length, 1);
});

test("registration, prefetch, and built worker freshness policies are present", () => {
  const registrationSource = fs.readFileSync(
    path.join(projectRoot, "src/scripts/service-worker.ts"),
    "utf8"
  );
  const astroConfig = fs.readFileSync(path.join(projectRoot, "astro.config.mjs"), "utf8");

  assert.match(registrationSource, /updateViaCache:\s*"none"/u);
  assert.match(registrationSource, /document\.readyState === "complete"/u);
  assert.match(registrationSource, /registration\.update\(\)/u);
  assert.match(astroConfig, /prefetch:\s*false/u);

  const builtWorkerPath = path.join(projectRoot, "dist/sw.js");
  if (!fs.existsSync(builtWorkerPath)) return;

  assert.equal(fs.readFileSync(builtWorkerPath, "utf8"), workerSource);
  const builtScriptDirectory = path.join(projectRoot, "dist/_astro");
  const clientRouterScripts = fs
    .readdirSync(builtScriptDirectory)
    .filter((name) => name.startsWith("ClientRouter.") && name.endsWith(".js"))
    .map((name) => fs.readFileSync(path.join(builtScriptDirectory, name), "utf8"));
  assert.notEqual(clientRouterScripts.length, 0);
  assert.doesNotMatch(clientRouterScripts.join("\n"), /data-astro-prefetch|Prefetching/u);

  const builtScripts = fs
    .readdirSync(builtScriptDirectory)
    .filter((name) => name.endsWith(".js"))
    .map((name) => fs.readFileSync(path.join(builtScriptDirectory, name), "utf8"))
    .join("\n");
  assert.match(builtScripts, /updateViaCache:\s*[`"']none[`"']/u);
  assert.match(builtScripts, /\.update\(\)/u);
});
