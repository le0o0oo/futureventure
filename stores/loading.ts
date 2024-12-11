import { defineStore } from "pinia";

export const useLoadingStore = defineStore({
  id: "loadingStore",
  state: () => ({
    isLoading: false,
  }),
  actions: {},
});
