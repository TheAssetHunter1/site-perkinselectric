import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import site from "./src/data/site.json" with { type: "json" };

export default defineConfig({
  site: site.url,
  trailingSlash: "ignore",
  integrations: [
    sitemap({ filter: (page) => !/\/(thanks|404)\/?$/.test(page) }),
  ],
  vite: { plugins: [tailwindcss()] },
});
