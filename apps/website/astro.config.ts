import path from "path";
import { fileURLToPath } from "url";
import { defineConfig } from "astro/config";
import preact from "@astrojs/preact";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import cloudflare from "@astrojs/cloudflare";
import auth from "auth-astro";

import { CONFIG } from "./src/config";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://astro.build/config
export default defineConfig({
  site: CONFIG.origin,
  integrations: [sitemap(), tailwind(), auth(), preact()],
  output: "server",
  adapter: cloudflare(),
  vite: {
    resolve: {
      alias: {
        "~": path.resolve(__dirname, "./src"),
      },
    },
    ssr: {
      external: ["node:path", "path", "os", "crypto"],
    },
  },
});
