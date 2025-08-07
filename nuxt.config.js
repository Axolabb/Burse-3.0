"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// https://nuxt.com/docs/api/configuration/nuxt-config
exports.default = defineNuxtConfig({
  ssr: false,
  imports: {
    scan: true, // отключает сканирование всех директорий
    autoImport: false // отключает авто-импорт
  },
  components: ["~/components"],
  // routeRules: {
  //     "/": { prerender: true, ssr: true },
  //     "/market": { swr: true },
  //     "/account": { ssr: false },
  //     "/login": { ssr: false },
  //     "/api/**": { cors: true },
  //   },
  app: {
    head: {
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1",
      title: "Vue Bit 3.0 with AI",
    },
  },
  compatibilityDate: "2024-04-03",
  devtools: {
    enabled: true,
    timeline: {
      enabled: true,
    },
  },
  css: ["bootstrap/dist/css/bootstrap.css"],
  postcss: {
    plugins: {
      autoprefixer: {},
    },
  },
  modules: ["@pinia/nuxt", "@nuxtjs/tailwindcss"],
  pinia: { storesDirs: ["./stores/**", "./custom-folder/stores/**"] },
});
