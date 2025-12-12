import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import UnoCSS from "unocss/vite";
import { crx } from "@crxjs/vite-plugin";
import { resolve } from "path";
import manifest from "./manifest.config";

export default defineConfig({
  plugins: [crx({ manifest }), vue(), UnoCSS()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  server: {
    host: true,
    port: 3000,
    hmr: {
      protocol: "ws",
      host: "localhost",
      port: 3000,
    },
  },
  build: {
    target: "esnext",
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
      mangle: true,
      format: {
        comments: false,
      },
    },
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        assetFileNames: function (assetInfo) {
          var info = assetInfo.name.split(".");
          var ext = info[info.length - 1];
          if (/css/i.test(ext)) {
            return "assets/style[extname]";
          }
          return "assets/[name][extname]";
        },
      },
    },
  },
});
