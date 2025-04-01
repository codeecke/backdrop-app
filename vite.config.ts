import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["icon.png"], // eigene Assets
      srcDir: "src",
      filename: "service-worker.ts",
      strategies: "injectManifest",
      manifest: {
        short_name: "Backdrop RC",
        name: "Backdrop RC",
        icons: [
          {
            src: "/icon.png",
            type: "image/png",
            sizes: "32x32",
          },
        ],
        start_url: "/",
        background_color: "#333",
        theme_color: "#ffC000",
        display: "standalone",
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
