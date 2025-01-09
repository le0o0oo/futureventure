import { defineStore } from "pinia";

export const useGameStateStore = defineStore({
  id: "gameStateStore",
  state: () => ({
    xp: 0,
    minigames: {
      traffic_light: {
        fixed_microprocessor: {
          status: false,
          reward: 10,
        },
        fixed_code: {
          status: false,
          reward: 30,
        },
        implemented_updates: {
          status: false,
          reward: 10,
        },
      },
    },
    dialogs: {
      traffic_light: {
        intro: false,
        blocks: false,
      },
    },
  }),
  actions: {},
});
