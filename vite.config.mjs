import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  logLevel: "info",
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    include: ["pixi.js"],
  },
});
