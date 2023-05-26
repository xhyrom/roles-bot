import path from "path";
import { fileURLToPath } from "url";
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import robotsTxt from "astro-robots-txt";
import compress from "astro-compress";
import tailwind from "@astrojs/tailwind";
import { CONFIG } from "./src/config";
import image from "@astrojs/image";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://astro.build/config
export default defineConfig({
  site: CONFIG.origin,
  base: "/",
  trailingSlash: "always",
  output: "static",
  integrations: [sitemap(), robotsTxt({
    policy: [{
      userAgent: "*"
    }],
    sitemap: true
  }), compress({
    css: true,
    html: true,
    img: true,
    js: true,
    svg: true
  }), tailwind(), image()],
  vite: {
    resolve: {
      alias: {
        "~": path.resolve(__dirname, "./src")
      }
    }
  }
});