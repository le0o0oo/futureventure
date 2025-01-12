import { defineStore } from "pinia";
import { Howl } from "howler";
import * as specialMeshes from "~/utils/specialMeshes";
import utilsMeshes from "~/utils/utilsMeshes";
import funcs from "~/utils/generalFuncs";

type minigameType =
  | ""
  | "traffic_light"
  | "cables_fix"
  | "broken_antenna"
  | "drone_spawn";

// https://invent.kde.org/plasma/ocean-sound-theme/-/blob/master/ocean/stereo/completion-success.oga?ref_type=heads
const taskTracker_leave = new Howl({
  src: ["/sounds/task-tracker_leave.oga"],
});

// https://invent.kde.org/plasma/ocean-sound-theme/-/blob/master/ocean/stereo/completion-partial.oga?ref_type=head
const taskTracker_enter = new Howl({
  src: ["/sounds/task-tracker_enter.mp3"],
});

let tempMesh: BABYLON.AbstractMesh | null = null;

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
      } else if (type == "broken_antenna") {
        const generalData = useGeneralStore();

        await funcs.delay(2000);

        assistant.say("...eeee si è rotta", {
          duration: 3000,
          icon: "normal",
        });

        await funcs.delay(2000);

        const drone = await utilsMeshes.drone.spawn();

        //@ts-ignore
        tempMesh = drone;
        drone.position = specialMeshes.meshes.drone_spawn[0]!.position.clone();
        drone.position.x = drone.position.x * -1;

        //specialMeshes.meshes.drone_spawn[0]!.dispose();
        specialMeshes.meshes.target = drone;
        specialMeshes.meshes.target.id = drone.id;

        assistant.say("Sarà tuo compito ripararla", {
          duration: 3000,
          icon: "normal",
        });

        await funcs.delay(2000);

        //@ts-ignore
        utilsMeshes.game!.getCamera()!.rotation.y = funcs.degToRad(180);

        generalData.activeControls = true;
        generalData.cameraFollow = true;

        specialMeshes.meshes.drone_spawn[0]!.renderOverlay = true;
        specialMeshes.meshes.drone_spawn[0]!.overlayColor = new BABYLON.Color3(
          0,
          1,
          0
        );
        await utilsMeshes.arrow.spawn(true);
        assistant.say(
          "Ho trovato un drone specializzato per le riparazioni giusto lì vicino",
          {
            duration: 5000,
            icon: "normal",
          }
        );
      }
    },

    clearTasks() {
      if (tempMesh) {
        tempMesh.dispose();
        tempMesh = null;
      }
      if (this.type == "drone_spawn") {
        specialMeshes.meshes.drone_spawn[0]!.renderOverlay = false;
        specialMeshes.meshes.drone_spawn[0]!.dispose();
      }
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
        case "broken_antenna":
          if (this.type == "drone_spawn") {
            return {
              tracker_text: "Vai al drone",
              button_text: "Usa",
              title_text: "Antenna fuori uso",
            };
          } else {
            return {
              tracker_text: "Ripara l'antenna",
              button_text: "Ripara",
              title_text: "Antenna fuori uso",
            };
          }

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
