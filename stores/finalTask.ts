import { defineStore } from "pinia";

export const useFinalTaskStore = defineStore({
  id: "finalTaskStore",
  state: () => ({
    running: false,
    pointingEarth: false,
    data_tansfer: false,
  }),
  actions: {},
});
