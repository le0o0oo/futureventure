// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  future: {
    compatibilityVersion: 4,
  },
  vite: {
    optimizeDeps: {
      exclude: ["@babylonjs/havok", "@babylonjs/loaders", "babylonjs-loaders"],
    },
  },

  runtimeConfig: {
    public: {
      speed: 0.1,
      keybinds: {
        forward: ["w", "W", "ArrowUp"],
        backward: ["s", "S", "ArrowDown"],
        left: ["a", "A", "ArrowLeft"],
        right: ["d", "D", "ArrowRight"],
      },
    },
  },

  ssr: false,
  modules: [
    "@pinia/nuxt",
    "@nuxtjs/tailwindcss",
    "@nuxtjs/color-mode",
    "shadcn-nuxt",
  ],
  shadcn: {
    prefix: "",
    componentDir: "./components/ui",
  },
});
