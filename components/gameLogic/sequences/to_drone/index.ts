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
};
