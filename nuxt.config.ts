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
  css: [
    "~/assets/css/tailwind.css",
    "~/assets/css/styles.css",
    "~/assets/css/blockly_styles.css",
  ],

  runtimeConfig: {
    public: {
      inDev: true, // Different from import.meta.dev

      speed: 0.035,
      keybinds: {
        up: ["w", "W", "ArrowUp"],
        down: ["s", "S", "ArrowDown"],
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
    "nuxt-svgo",
    "@vueuse/nuxt",
    "@formkit/auto-animate",
    "@nuxt/icon",
  ],
  shadcn: {
    prefix: "",
    componentDir: "./components/ui",
  },
  colorMode: {
    classSuffix: "",
  },
});
