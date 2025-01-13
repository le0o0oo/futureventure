import { defineStore } from "pinia";

export const useInfoStore = defineStore({
  id: "infoStore",
  state: () => ({
    slideState: 1,
    show: false,
    showComponent: false,

    progress: { progressState: 100, slideshowPlaying: false, rate: 0.5 },
  }),
  actions: {
    resetProgress(rate?: number) {
      this.progress.progressState = 100;
      this.progress.slideshowPlaying = true;
      this.progress.rate = rate ?? this.progress.rate;
    },
  },
});
