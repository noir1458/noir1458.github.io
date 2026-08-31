import type { APIRoute } from "astro";
import { SITE } from "@/config";

export const GET: APIRoute = () =>
  new Response(
    JSON.stringify(
      {
        name: SITE.title,
        short_name: SITE.author.displayName,
        description: SITE.description,
        start_url: "/",
        scope: "/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#ffffff",
        icons: [
          {
            src: SITE.manifestIcon,
            sizes: "any",
            type: "image/svg+xml",
            purpose: "any maskable"
          }
        ]
      },
      null,
      2
    ),
    {
      headers: {
        "Content-Type": "application/manifest+json; charset=utf-8"
      }
    }
  );
