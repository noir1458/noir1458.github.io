import type { APIRoute } from "astro";
import { FEATURES, SITE } from "@/config";

export const GET: APIRoute = () =>
  new Response(
    [
      "User-agent: *",
      "Allow: /",
      ...(FEATURES.sitemap ? ["", `Sitemap: ${new URL("/sitemap-index.xml", SITE.url)}`] : []),
      ""
    ].join("\n"),
    {
      headers: {
        "Content-Type": "text/plain; charset=utf-8"
      }
    }
  );
