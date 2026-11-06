import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { chromium } from "playwright";

const dist = path.resolve(import.meta.dirname, "../dist");
function htmlFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(directory, entry.name);
    return entry.isDirectory() ? htmlFiles(file) : entry.name.endsWith(".html") ? [file] : [];
  });
}
const pages = htmlFiles(dist).filter((file) =>
  fs.readFileSync(file, "utf8").includes('class="mermaid-block"')
);
if (pages.length === 0) {
  console.log(JSON.stringify({ diagramPages: 0, diagrams: 0, errors: [] }));
  process.exit(0);
}

const mime = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css",
  ".js": "text/javascript",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".png": "image/png",
  ".woff2": "font/woff2",
  ".woff": "font/woff"
};
const server = http.createServer((request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url, "http://localhost").pathname);
    let file = path.resolve(dist, `.${pathname}`);
    if (!file.startsWith(`${dist}${path.sep}`) && file !== dist) throw new Error("Invalid path");
    if (fs.statSync(file).isDirectory()) file = path.join(file, "index.html");
    response.writeHead(200, {
      "Content-Type": mime[path.extname(file)] ?? "application/octet-stream"
    });
    response.end(fs.readFileSync(file));
  } catch {
    response.writeHead(404);
    response.end();
  }
});
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const origin = `http://127.0.0.1:${server.address().port}`;
let browser;
const errors = [];
const screenRatios = [];
const printRatios = [];
let diagrams = 0;
let mobileScrollDiagrams = 0;
const cases = [
  { name: "desktop", width: 1440, height: 1000, media: "screen", theme: "light" },
  { name: "desktop-dark", width: 1440, height: 1000, media: "screen", theme: "dark" },
  { name: "tablet", width: 900, height: 1000, media: "screen", theme: "light" },
  { name: "mobile", width: 390, height: 844, media: "screen", theme: "light" },
  { name: "mobile-dark", width: 390, height: 844, media: "screen", theme: "dark" },
  // Match the printable content width with the site's 18 mm page margins.
  { name: "A4", width: 658, height: 1123, media: "print", theme: "light" },
  { name: "Letter", width: 680, height: 1056, media: "print", theme: "dark" }
];
try {
  browser = await chromium.launch();
  const page = await browser.newPage({ javaScriptEnabled: false, serviceWorkers: "block" });
  await page.route("**/*", (route) =>
    new URL(route.request().url()).origin === origin ? route.continue() : route.abort()
  );
  for (const file of pages) {
    const route = `/${path
      .relative(dist, file)
      .split(path.sep)
      .join("/")
      .replace(/index\.html$/u, "")}`;
    await page.goto(`${origin}${route}`, { waitUntil: "networkidle" });
    await page.evaluate(async () => {
      await Promise.all(
        Array.from(document.querySelectorAll(".mermaid-diagram-image"), (image) => image.decode())
      );
      await document.fonts.ready;
    });
    for (const scenario of cases) {
      await page.setViewportSize({ width: scenario.width, height: scenario.height });
      await page.emulateMedia({ media: scenario.media });
      await page.evaluate((theme) => {
        document.documentElement.dataset.theme = theme;
      }, scenario.theme);
      const measurements = await page.locator(".mermaid-block").evaluateAll((blocks) =>
        blocks.map((block, index) => {
          const image = Array.from(block.querySelectorAll(".mermaid-diagram-image")).find(
            (item) => getComputedStyle(item).display !== "none"
          );
          if (!image) return { index: index + 1, invalid: true };
          const width = Number(image.dataset.mermaidWidth);
          const height = Number(image.dataset.mermaidHeight);
          const fontSize = Number(image.dataset.mermaidFontSize);
          const rect = image.getBoundingClientRect();
          const content = block.closest(".article-content");
          const frame = block.querySelector(".mermaid-diagram");
          const fontRatio =
            (fontSize * Math.min(rect.width / width, rect.height / height))
            / parseFloat(getComputedStyle(content).fontSize);
          return {
            index: index + 1,
            invalid:
              ![width, height, fontSize, fontRatio].every(
                (value) => Number.isFinite(value) && value > 0
              )
              || !image.complete
              || image.naturalWidth === 0,
            fontRatio,
            horizontalScroll: frame.scrollWidth - frame.clientWidth,
            pageOverflow: document.documentElement.scrollWidth - innerWidth,
            dark: image.classList.contains("mermaid-diagram-dark")
          };
        })
      );
      if (scenario.name === "desktop") diagrams += measurements.length;
      for (const measurement of measurements) {
        const label = `${route} diagram ${measurement.index} (${scenario.name})`;
        if (measurement.invalid) {
          errors.push(`${label}: missing SVG sizing metadata or broken image`);
          continue;
        }
        (scenario.media === "print" ? printRatios : screenRatios).push(measurement.fontRatio);
        if (measurement.fontRatio < 0.9 || measurement.fontRatio > 1.05) {
          errors.push(
            `${label}: text is ${(measurement.fontRatio * 100).toFixed(1)}% of the body size; adjust labels, direction, or split the diagram`
          );
        }
        if (measurement.pageOverflow > 1) errors.push(`${label}: horizontal page overflow`);
        if (scenario.name.startsWith("desktop") && measurement.horizontalScroll > 1)
          errors.push(`${label}: diagram is wider than the desktop article`);
        if (scenario.name === "mobile" && measurement.horizontalScroll > 1)
          mobileScrollDiagrams += 1;
        if (measurement.dark !== (scenario.media === "screen" && scenario.theme === "dark"))
          errors.push(`${label}: incorrect diagram theme`);
      }
    }
  }
} finally {
  await browser?.close();
  await new Promise((resolve) => server.close(resolve));
}
const range = (values) => ({
  min: Number(Math.min(...values).toFixed(3)),
  max: Number(Math.max(...values).toFixed(3))
});
console.log(
  JSON.stringify(
    {
      diagramPages: pages.length,
      diagrams,
      screenFontRatio: range(screenRatios),
      printFontRatio: range(printRatios),
      mobileScrollDiagrams,
      errors
    },
    null,
    2
  )
);
if (errors.length > 0) process.exitCode = 1;
