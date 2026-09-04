const CACHE_PREFIX = "astro-blog-";
const CACHE_NAME = `${CACHE_PREFIX}v5`;
const SCOPE_URL = new URL(self.registration.scope);
const OFFLINE_URL = new URL("404.html", SCOPE_URL).href;
const ASTRO_ASSET_PATH = `${SCOPE_URL.pathname}_astro/`;
const HASHED_ASSET_PATTERN = /\.[A-Za-z0-9_-]{8,}\.[A-Za-z0-9]+$/u;

const isPageRequest = (request) =>
  request.mode === "navigate"
  || request.destination === "document"
  || request.headers.get("accept")?.includes("text/html");

const isImmutableAstroAsset = (url) =>
  url.pathname.startsWith(ASTRO_ASSET_PATH)
  && HASHED_ASSET_PATTERN.test(url.pathname.slice(ASTRO_ASSET_PATH.length));

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.add(new Request(OFFLINE_URL, { cache: "no-store" })))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME)
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  if (event.request.method !== "GET" || url.origin !== location.origin) return;

  // Astro's client router fetches the next document without using navigation mode.
  // Treat every HTML request as a page so an older cached document cannot be mixed
  // with the current layout after a deployment.
  if (isPageRequest(event.request)) {
    event.respondWith(
      fetch(event.request, { cache: "no-store" }).catch(async (error) => {
        const cache = await caches.open(CACHE_NAME);
        const fallback = await cache.match(OFFLINE_URL);
        if (fallback) return fallback;
        throw error;
      })
    );
    return;
  }

  if (!isImmutableAstroAsset(url)) return;

  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      const cached = await cache.match(event.request);
      if (cached) return cached;

      const response = await fetch(event.request);
      if (response.ok) event.waitUntil(cache.put(event.request, response.clone()));
      return response;
    })
  );
});
