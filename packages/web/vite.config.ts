import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      strategies: "injectManifest",
      srcDir: "src/workers",
      filename: "sw.ts",
      injectManifest: {
        injectionPoint: "self.__WB_MANIFEST",
      },
      devOptions: { enabled: true, type: "module" },
    }),
  ],

  // WASM binary: treat as a static URL asset, not inlined
  assetsInclude: ["**/*.wasm"],

  // resolve wasm-core dist so Vite can find imgproc.wasm at build time
  resolve: {
    alias: {
      "@imgproc/wasm-core": "../../packages/wasm-core/dist/imgproc.js",
    },
  },

  server: {
    headers: {
      // Required for SharedArrayBuffer — zero-copy pixel transfer
      "Cross-Origin-Opener-Policy": "same-origin",
      "Cross-Origin-Embedder-Policy": "require-corp",
    },
  },

  worker: {
    format: "es",
  },
});
