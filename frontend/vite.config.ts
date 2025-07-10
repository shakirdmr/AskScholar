
import tailwind from '@tailwindcss/vite';
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { NodeGlobalsPolyfillPlugin } from "@esbuild-plugins/node-globals-polyfill";
import nodePolyfills from "rollup-plugin-node-polyfills";

export default defineConfig({
  plugins: [react(), tailwind()],
  optimizeDeps: {
    esbuildOptions: {
      plugins: [
        NodeGlobalsPolyfillPlugin({
          process: true,
          buffer: true,
        })
      ],
      define: {
        global: "globalThis"
      }
    }
  },
  build: {
    rollupOptions: {
      plugins: [nodePolyfills()]
    }
  },
  resolve: {
    alias: {
      events: "events/",
      util: "util/"
    }
  }
});

