import VueVideoPlayer from "@videojs-player/vue";

export default defineNuxtPlugin((nuxtApp) => {
  if (import.meta.client) nuxtApp.vueApp.use(VueVideoPlayer);
});
