import type Engine from "../../Engine";
import { Observer, Scene, Vector3, type FreeCamera } from "babylonjs";
import funcs from "~/utils/generalFuncs";
import assistant from "~/utils/assistant";
import utilsMeshes from "~/utils/utilsMeshes";

export default async (game: Engine) => {
  const tasksStore = useTasksStore();
  const gameState = useGameStateStore();
  const generalData = useGeneralStore();
  const camera = game.getCamera() as FreeCamera;

  // await funcs.delay(3000);

  tasksStore.clearTasks();

  await funcs.delay(3000);

  assistant.say(
    "Per andare su o giù usa rispettivamente il tasto <strong>Spazio</strong> e <strong>Shift</strong>",
    {
      duration: 4000,
      icon: "normal",
    }
  );

  await funcs.delay(3000);

  tasksStore.setTaskTracker("broken_antenna_real");

  const videos: string[] = [
    "/satellite_demo/demo_1_1.mp4",
    "/satellite_demo/demo_1.mp4",
    "/satellite_demo/demo_2.mp4",
    "/satellite_demo/demo_3.mp4",
    "/satellite_demo/demo_4.mp4",
    "/satellite_demo/demo_5.mp4",
    "/satellite_demo/demo_6.mp4",
    "/satellite_demo/demo_7.mp4",
    "/satellite_demo/demo_8.mp4",
  ];
  funcs.preloadVideos(videos, (loadedVideos, errors) => {
    console.log("Loaded videos:", loadedVideos);
    if (errors.length > 0) {
      console.log("Failed to load:", errors);
    } else {
      console.log("All videos loaded successfully!");
    }
  });
};
