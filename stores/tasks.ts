import { defineStore } from "pinia";
import { Howl } from "howler";
import * as specialMeshes from "~/utils/specialMeshes";
import utilsMeshes from "~/utils/utilsMeshes";

type minigameType = "" | "traffic_light" | "cables_fix";

// https://invent.kde.org/plasma/ocean-sound-theme/-/blob/master/ocean/stereo/completion-success.oga?ref_type=heads
const taskTracker_leave = new Howl({
  src: ["/sounds/task-tracker_leave.oga"],
});

// https://invent.kde.org/plasma/ocean-sound-theme/-/blob/master/ocean/stereo/completion-partial.oga?ref_type=head
const taskTracker_enter = new Howl({
  src: ["/sounds/task-tracker_enter.mp3"],
});

export const useTasksStore = defineStore({
  id: "tasksStore",
  state: () => ({
    showMessage: false,
    showMinigame: false,
    doingTask: false,
    inProgress: false,

    type: "" as minigameType,

    currentMinigame: "" as minigameType,

    taskTracker: {
      show: false,
      completed: false,
      type: "" as minigameType,
    },
  }),
  actions: {
    async setTaskTracker(type: minigameType) {
      this.inProgress = true;
      this.type = type;

      this.taskTracker.type = type;
      this.taskTracker.show = true;

      taskTracker_enter.play();

      if (type == "traffic_light") {
        const randomIndex = Math.floor(
          Math.random() * specialMeshes.meshes.traffic_light.length
        );

        const mesh = specialMeshes.meshes.traffic_light[randomIndex];

        specialMeshes.meshes.target = mesh!;

        // mesh!.renderOutline = true;
        mesh!.renderOverlay = true;
        mesh!.outlineColor = new BABYLON.Color3(0, 1, 0);
        mesh!.outlineWidth = 0.05;

        mesh!.overlayColor = new BABYLON.Color3(0, 1, 0);

        await utilsMeshes.arrow.spawn();
      } else if (type === "cables_fix") {
        const randomIndex = Math.floor(
          Math.random() * specialMeshes.meshes.traffic_light.length
        );

        const mesh = specialMeshes.meshes.cables_fix[randomIndex];

        specialMeshes.meshes.target = mesh!;

        // mesh!.renderOutline = true;
        mesh!.renderOverlay = true;
        mesh!.outlineColor = new BABYLON.Color3(0, 1, 0);
        mesh!.outlineWidth = 0.05;

        mesh!.overlayColor = new BABYLON.Color3(0, 1, 0);

        await utilsMeshes.arrow.spawn();
      }
    },

    clearTasks() {
      if (specialMeshes.meshes.target) {
        utilsMeshes.arrow.despawn();
        specialMeshes.meshes.target.renderOverlay = false;
        specialMeshes.meshes.target = null;
      }

      taskTracker_leave.play();
      this.taskTracker.completed = true;

      setTimeout(() => {
        this.inProgress = false;
        this.type = "";

        this.taskTracker.type = this.type;
        this.taskTracker.show = false;
        this.taskTracker.completed = false;
      }, 1800);
    },

    getTaskText(type: minigameType): {
      tracker_text: string;
      button_text: string;
      title_text: string;
    } {
      switch (type) {
        case "traffic_light":
          return {
            tracker_text: "Segui la direzione della freccia",
            button_text: "Ripara",
            title_text: "Riparazione semaforo",
          };
        case "cables_fix":
          return {
            tracker_text: "Vai nella direzione della freccia",
            button_text: "Ripara",
            title_text: "Riparazione circuito",
          };
        default:
          return {
            tracker_text: "-",
            button_text: "-",
            title_text: "-",
          };
      }
    },
  },
});

export type { minigameType };
