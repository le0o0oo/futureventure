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
    build: {
      minify: "terser",
      terserOptions: {
        keep_fnames: true,
      },
    },
  },
  css: [
    "~/assets/css/tailwind.css",
    "~/assets/css/styles.css",
    "~/assets/css/blockly_styles.css",
  ],

  runtimeConfig: {
    public: {
      speed: 0.035,
      keybinds: {
        up: ["w", "W", "ArrowUp"],
        down: ["s", "S", "ArrowDown"],
        left: ["a", "A", "ArrowLeft"],
        right: ["d", "D", "ArrowRight"],
      },
    },
  },

  modules: [
    "@pinia/nuxt",
    "@nuxtjs/tailwindcss",
    "@nuxtjs/color-mode",
    "shadcn-nuxt",
    "nuxt-svgo",
    "@vueuse/nuxt",
    "@formkit/auto-animate",
    "@nuxt/icon",
    "@nuxt/scripts",
  ],
  shadcn: {
    prefix: "",
    componentDir: "./components/ui",
  },
  colorMode: {
    classSuffix: "",
  },
  app: {
    head: {
      link: [{ rel: "icon", type: "image/png", href: "/icon.png" }],
      title: "FutureVenture",
    },
    pageTransition: { name: "page", mode: "out-in" },
    layoutTransition: { name: "page", mode: "out-in" },
  },

  ssr: false, // Vue video player is the problem
});
