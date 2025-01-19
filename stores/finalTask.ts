import { defineStore } from "pinia";

let counter = 0;

export const useFinalTaskStore = defineStore({
  id: "finalTaskStore",
  state: () => ({
    running: true,
    pointingEarth: false,
    data_tansfer: false,
    solar_storms: false,
    every_task: false,

    consoleElement: null as HTMLElement | null,
    console: [] as { msg: string; type: "log" | "error"; id: number }[],

    serializedWorkspace: null as any,

    inFinalTest: false,

    testing: {
      testing: false,
      solarStorm: false,
      dataTransfer: false,
    },
  }),
  actions: {
    addMessage(message: string, error?: boolean) {
      if (this.console.length > 30) this.console.shift();
      counter++;
      this.console.push({
        msg: message,
        type: error ? "error" : "log",
        id: counter,
      });

      if (this.consoleElement)
        this.consoleElement.scrollTop = this.consoleElement.scrollHeight;
    },
    clearConsole() {
      counter = 0;
      this.console = [];
    },
  },
});
