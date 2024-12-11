import { defineStore } from "pinia";
import Models from "~/components/gameLogic/Models";
import type Engine from "~/components/gameLogic/Engine";

export const useSharedData = defineStore({
  id: "sharedDataStore",
  state: () => ({
    models: null as Models | null,
  }),
  actions: {
    initModels(game: Engine): Models {
      this.models = new Models(game);

      return this.models;
    },
  },
});
