import { defineStore } from "pinia";

export const useGeneralStore = defineStore({
  id: "generalStore",
  state: () => ({
    cameraFollow: true,
    activeControls: true,

    inDev: false,
  }),
  actions: {},
});
