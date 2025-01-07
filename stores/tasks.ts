import { defineStore } from "pinia";

export const useTasksStore = defineStore({
  id: "tasksStore",
  state: () => ({
    showMessage: false,

    type: "" as "" | "traffic_light",
  }),
  actions: {},
});
