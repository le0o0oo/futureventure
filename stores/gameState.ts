import { defineStore } from "pinia";

/* PROGRESS
 0 - Player completely new, never done a task
 1 - Player has done the first task
*/

export const useGameStateStore = defineStore({
  id: "gameStateStore",
  state: () => ({
    xp: 0,
    progress: 0,
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
      cables_fix: {
        completion: {
          status: false,
          reward: 10,
        },
        first_try: {
          status: true,
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
