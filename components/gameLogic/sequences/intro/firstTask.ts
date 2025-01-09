import type Engine from "../../Engine";
import { Observer, Scene, Vector3, type FreeCamera } from "babylonjs";
import funcs from "~/utils/generalFuncs";
import assistant from "~/utils/assistant";

export default async (game: Engine) => {
  const tasksStore = useTasksStore();

  // assistant.say("Per adesso sarai un robot tuttofare", {
  //   duration: 4000,
  // });

  // await funcs.delay(2900);

  // assistant.say("A breve ti verranno assegnate diverse task da completare...", {
  //   duration: 4000,
  // });

  // await funcs.delay(3000);

  // assistant.say("Non ti preoccupare, nulla di troppo complicato ;)", {
  //   duration: 4000,
  // });

  // await funcs.delay(5000);

  tasksStore.setTaskTracker("traffic_light");

  await funcs.delay(1000);

  assistant.say("Ecco il tuo primo incarico!", {
    duration: 4000,
  });

  await funcs.delay(3000);

  assistant.say("Vai nella direzione della freccia e accetta l'incarico!", {
    duration: 4000,
  });
};
