import type Engine from "../../Engine";
import { Observer, Scene, Vector3, type FreeCamera } from "babylonjs";
import funcs from "~/utils/generalFuncs";
import assistant from "~/utils/assistant";

export default async (game: Engine) => {
  const tasksStore = useTasksStore();

  tasksStore.setTaskTracker("traffic_light");

  await funcs.delay(1000);

  assistant.say("Ecco il tuo primo incarico!", {
    duration: 4000,
  });

  await funcs.delay(3000);

  assistant.say("Vai nella direzione della freccia e ripara quel semaforo!", {
    duration: 4000,
  });
};
