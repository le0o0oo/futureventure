import { defineStore } from "pinia";
import * as BABYLON from "babylonjs";

export const useEngineStore = defineStore({
  id: "engineStore",
  state: () => ({
    BABYLON: {},
  }),
  actions: {},
});
