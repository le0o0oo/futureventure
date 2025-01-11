import { defineStore } from "pinia";
import { Howl } from "howler";
import * as specialMeshes from "~/utils/specialMeshes";
import utilsMeshes from "~/utils/utilsMeshes";

type minigameType = "" | "traffic_light";

// https://invent.kde.org/plasma/ocean-sound-theme/-/blob/master/ocean/stereo/completion-success.oga?ref_type=heads
const taskTrackerSound = new Howl({
  src: ["/sounds/notification.mp3"],
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
      type: "" as minigameType,
    },
  }),
  actions: {
    async setTaskTracker(type: minigameType) {
      this.inProgress = true;
      this.type = type;

      this.taskTracker.type = type;
      this.taskTracker.show = true;

      taskTrackerSound.play();

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
      }
    },

    clearTasks() {
      if (specialMeshes.meshes.target) {
        utilsMeshes.arrow.despawn();
        specialMeshes.meshes.target.renderOverlay = false;
        specialMeshes.meshes.target = null;
      }

      this.inProgress = true;
      this.type = "";

      this.taskTracker.type = this.type;
      this.taskTracker.show = false;
    },
  },
});

export type { minigameType };
