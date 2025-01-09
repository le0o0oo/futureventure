import { defineStore } from "pinia";
import Models from "~/components/gameLogic/Models";
import type Engine from "~/components/gameLogic/Engine";

export const useSharedData = defineStore({
  id: "sharedDataStore",
  state: () => ({
    cameraInSight: false,
  }),
  actions: {},
});
