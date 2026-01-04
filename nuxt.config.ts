import tailwindcss from "@tailwindcss/vite";
import Aura from "@primeuix/themes/aura";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  vite: {
    plugins: [tailwindcss()],
  },
  css: ["./app/assets/css/main.css"],
  modules: ["@primevue/nuxt-module", "@nuxtjs/color-mode", "@pinia/nuxt"],
  colorMode: {
    classSuffix: "", // Tailwind looks for '.dark'
    preference: "system",
    fallback: "light",
    storageKey: "nuxt-color-mode",
  },
  primevue: {
    options: {
      theme: {
        preset: Aura,
        options: {
          darkModeSelector: ".dark", // Syncs with Tailwind dark mode
        },
      },
    },
  },
  app: {
    head: {
      htmlAttrs: { class: "h-full" },
      bodyAttrs: {
        class:
          "h-full bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors",
      },
    },
  },
  runtimeConfig: {
    apiBaseUrl: process.env.NUXT_PUBLIC_API_URL || "http://localhost:8000/api",
  },
});
