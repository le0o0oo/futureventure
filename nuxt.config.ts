// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  modules: ["@nuxtjs/tailwindcss", "@pinia/nuxt", "@nuxtjs/color-mode"],
  vite: {
    optimizeDeps: {
      exclude: ["@babylonjs/havok"],
    },
  },

  runtimeConfig: {
    public: {
      speed: 200,
      keybinds: {
        forward: ["w", "W", "ArrowUp"],
        backward: ["s", "S", "ArrowDown"],
        left: ["a", "A", "ArrowLeft"],
        right: ["d", "D", "ArrowRight"],
      },
    },
  },

  ssr: false,
});
