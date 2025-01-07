import path from "path";
import { fileURLToPath } from "url";
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import robotsTxt from "astro-robots-txt";
import compress from "astro-compress";
import tailwind from "@astrojs/tailwind";
import { CONFIG } from "./src/config";
import image from "@astrojs/image";
import starlight from "@astrojs/starlight";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://astro.build/config
export default defineConfig({
  site: CONFIG.origin,
  base: "/",
  output: "static",
  integrations: [
    starlight({
      title: "Roles Bot Documentation",
      customCss: ["./src/styles/custom.css"],
      sidebar: [
        {
          label: "Getting Started",
          items: [
            { label: "Frequently Asked Questions", slug: "getting-started" },
          ],
        },
      ],
    }),
    sitemap(),
    robotsTxt({
      policy: [
        {
          userAgent: "*",
        },
      ],
      sitemap: true,
    }),
    compress({
      css: true,
      html: true,
      img: true,
      js: true,
      svg: true,
    }),
    tailwind(),
    image(),
  ],
  vite: {
    resolve: {
      alias: {
        "~": path.resolve(__dirname, "./src"),
      },
    },
  },
});
