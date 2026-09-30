import { defineConfig } from "vite";
export default defineConfig({
  base: process.env.VITE_BASE_PATH || "/",
  build: {
    rollupOptions: {
      input: {
        main: "index.html",
        negocio: "negocio.html",
        equipe: "equipe.html",
      },
    },
  },
});
