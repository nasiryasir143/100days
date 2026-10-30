import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import { fileURLToPath } from "node:url";

const isProd = process.env.NODE_ENV === "production";

export default defineConfig({
  site: "https://nasiryasir143.github.io",
  base: isProd ? "/100days" : "/",
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
  ],
  vite: {
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
  },
});
