import type Engine from "~/components/gameLogic/Engine";
import { Observer, Scene, Vector3, type FreeCamera } from "babylonjs";
import funcs from "~/utils/generalFuncs";
import assistant from "~/utils/assistant";
import utilsMeshes from "~/utils/utilsMeshes";
import { eventBus } from "~/event-bus";
import * as Blockly from "blockly";
import { javascriptGenerator } from "blockly/javascript";
import { Jinter } from "jintr";
import * as specialMeshes from "~/utils/specialMeshes";
import { toast } from "vue-sonner";

let blocklyWorkspace: Blockly.WorkspaceSvg;
let lastEventType = "" as Blockly.Events.Abstract["type"];

const genCode = {
  loop: {
    code: "",
    //instructions: [] as string[],
  },
};

let foundErrors = false;

let dataStatus = {
  packets_num: 0,
  beam_visible: false,
  beam_connected: false,

  sensors_enabled: true,
  communications_enabled: true,

  reset() {
    this.packets_num = 0;
    this.beam_visible = false;
    this.beam_connected = false;

    this.sensors_enabled = true;
  },
};

export function setBlocklyWorkspace(workspace: Blockly.WorkspaceSvg) {
  blocklyWorkspace = workspace;
  run();
}

function resetTest() {
  const finaltaskStore = useFinalTaskStore();

  finaltaskStore.testing.testing = false;
  finaltaskStore.testing.solarStorm = false;
  finaltaskStore.testing.dataTransfer = false;
}

async function run() {
  if (!blocklyWorkspace) return;
  const game = utilsMeshes.game!;
  const camera = game.getCamera() as FreeCamera;
  const gameState = useGameStateStore();
  const tasksStore = useTasksStore();
  const finaltaskStore = useFinalTaskStore();
  const jinter = new Jinter();

  let hasHit = false;

  const solarStormTest = () =>
    new Promise(async (resolve, reject) => {
      compileCode();

      toast.info("Entrando nella tempesta solare");
      jinter.evaluate("solarstorm_enter()");

      await funcs.delay(1000);

      if (
        foundErrors ||
        dataStatus.sensors_enabled ||
        dataStatus.communications_enabled
      ) {
        reject();
        finaltaskStore.solar_storms = false;
        return;
      }

      toast.info("Uscendo dalla tempesta solare");
      jinter.evaluate("solarstorm_leave()");

      await funcs.delay(1000);

      if (
        foundErrors ||
        !dataStatus.sensors_enabled ||
        !dataStatus.communications_enabled ||
        !finaltaskStore.pointingEarth
      ) {
        reject();
        finaltaskStore.solar_storms = false;
        return;
      }

      resolve(true);
      resetTest();
      finaltaskStore.solar_storms = true;
    });

  const dataTransferTest = () =>
    new Promise(async (resolve, reject) => {
      compileCode();

      dataStatus.beam_connected = true;
      dataStatus.beam_visible = true;
      jinter.evaluate("on_beam_detect()");

      await funcs.delay(5000);

      if (
        foundErrors ||
        dataStatus.packets_num > 0 ||
        !finaltaskStore.pointingEarth
      ) {
        reject();

        return;
      }

      resolve(true);
      resetTest();
      finaltaskStore.data_tansfer = true;
    });

  eventBus.addEventListener(
    "test_satellite",
    async (event: CustomEventInit) => {
      foundErrors = false;
      if (event.detail == "solarStorm") {
        if (!finaltaskStore.inFinalTest) {
          toast.promise(solarStormTest, {
            loading: "Testando tempesta solare...",
            position: "top-right",
            success: () => {
              compileCode();
              return `Test superato`;
            },
            error: (data: any) => {
              resetTest();
              compileCode();
              return "Test fallito";
            },
          });
        } else {
          solarStormTest().finally(() => {
            eventBus.dispatchEvent(new Event("test_satellite_complete"));
          });
        }
      } else if (event.detail == "dataTransfer") {
        if (!finaltaskStore.inFinalTest) {
          toast.promise(dataTransferTest, {
            loading: "Testando trasferimento dati...",
            position: "top-right",
            success: () => {
              compileCode();
              return `Test superato`;
            },
            error: (data: any) => {
              resetTest();
              compileCode();
              return "Test fallito";
            },
          });
        } else {
          dataTransferTest().finally(() => {
            eventBus.dispatchEvent(new Event("test_satellite_complete"));
          });
        }
      } else if (event.detail == "both") {
        compileCode();

        dataStatus.beam_connected = true;
        dataStatus.beam_visible = true;
        jinter.evaluate("on_beam_detect()");

        await funcs.delay(1000);

        toast.info("Entrando nella tempesta solare");
        jinter.evaluate("solarstorm_enter()");

        await funcs.delay(1000);

        if (foundErrors || dataStatus.sensors_enabled) {
          finaltaskStore.every_task = false;
          eventBus.dispatchEvent(new Event("test_satellite_complete"));

          return;
        }

        toast.info("Uscendo dalla tempesta solare");
        jinter.evaluate("solarstorm_leave()");

        await funcs.delay(1000);

        if (
          foundErrors ||
          !dataStatus.sensors_enabled ||
          !finaltaskStore.pointingEarth
        ) {
          finaltaskStore.every_task = false;
          eventBus.dispatchEvent(new Event("test_satellite_complete"));

          return;
        }

        await funcs.delay(5000);

        if (
          foundErrors ||
          dataStatus.packets_num > 0 ||
          !finaltaskStore.pointingEarth
        ) {
          finaltaskStore.every_task = false;
          eventBus.dispatchEvent(new Event("test_satellite_complete"));

          return;
        }

        finaltaskStore.every_task = true;
        eventBus.dispatchEvent(new Event("test_satellite_complete"));
      }
    }
  );
  eventBus.addEventListener("compail", (event: CustomEventInit) => {
    compileCode();
  });

  eventBus.addEventListener("run_satellite", (event: CustomEventInit) => {
    runCode(event.detail);
  });

  eventBus.addEventListener("serialize", (event: CustomEventInit) => {
    const state = Blockly.serialization.workspaces.save(blocklyWorkspace);
    console.log(state);
  });

  blocklyWorkspace.addChangeListener((event) => {
    //lastEventType = event.type;
    if (
      event.type == "viewport_change" ||
      event.type == "click" ||
      event.type == "toolbox_item_select" ||
      event.type == "selected" ||
      event.type == "drag" ||
      event.type == "create"
    )
      return;
    compileCode();
  });

  async function compileCode() {
    if (!blocklyWorkspace) return;

    const generatedCode = javascriptGenerator.workspaceToCode(blocklyWorkspace);

    jinter.scope.clear();
    finaltaskStore.clearConsole();
    dataStatus.reset();
    dataStatus.packets_num = funcs.randomInt(50, 70);

    let finalCode = generatedCode;

    const queries = [
      "dataStatus.sensors_enabled = false;",
      "dataStatus.sensors_enabled = true;",
      "transfer_packet();",
    ];

    // queries.forEach((query) => {
    //   if (finalCode.includes(query) && !finalCode.includes(`  ${query}`)) {
    //     finalCode = finalCode.replace(query, "");
    //   }
    // });

    console.log(finalCode);
    jinter.evaluate(finalCode);
    // const codeBlocks = generatedCode.split("!!");
    // codeBlocks.shift();

    // codeBlocks.forEach((rawCodeBlock) => {
    //   const block1 = rawCodeBlock
    //     .replaceAll("  ", "")
    //     .replaceAll("\n\n", "")
    //     .replaceAll("\n", "")
    //     .split(";");
    //   const blockType = block1.shift();
    //   // if (blockType == "LOOP") {
    //   //   genCode.loop.code = block1.join(";\n");
    //   //   //genCode.loop.instructions = block1;
    //   //   console.log(genCode.loop.code);
    //   // }
    // });
  }

  async function runCode(part: keyof typeof genCode) {
    //const instructions = genCode[part].instructions;

    jinter.evaluate(`try {${part}()} catch(err) {}`);

    // for (const line in instructions) {
    //   const tokens = instructions[line]!.split(" ");

    //   if (tokens[0] == "LOOK_AT") {
    //     if (tokens[1] == "(EARTH_COORDS)") satellite.lookAt(earth.position);
    //   }
    // }
  }

  camera.position = new Vector3(5.267, 3.984, -6.074);
  camera.rotation = new Vector3(
    funcs.degToRad(8.62),
    funcs.degToRad(273.89),
    0
  );

  await game.models?.ClearMap();
  game.setSkybox("skybox_space/skybox_space");

  const earth = (await utilsMeshes.earth.spawn())!;
  const satellite = (await utilsMeshes.satellite.spawn())!;

  earth.scaling.setAll(0.1);
  var earthAggregate = new BABYLON.PhysicsAggregate(
    //@ts-ignore
    earth,
    BABYLON.PhysicsShapeType.CAPSULE,
    { mass: 0, restitution: 0.75, friction: 5, radius: 5 },
    game.scene
  );
  const sun = BABYLON.MeshBuilder.CreateSphere(
    "sun",
    {
      diameter: 30,
      segments: 16,
    },
    //@ts-ignore
    game.scene
  );
  sun.position = new BABYLON.Vector3(-485.74, 62.51, 74.69);
  //@ts-ignore
  sun.material = specialMeshes.getInvisibleMaterial();

  camera.maxZ = 30000;

  game.skySun!.direction = new Vector3(
    funcs.degToRad(-3.69),
    funcs.degToRad(-0.644),
    funcs.degToRad(0.086)
  );
  camera.position = new Vector3(127.3, 8.9, 58.09);
  camera.rotation = new Vector3(
    funcs.degToRad(3.86),
    funcs.degToRad(260.09),
    0
  );

  satellite.position = new Vector3(104.4, 6.91, 60.14);

  satellite.rotation = new Vector3(
    funcs.degToRad(funcs.randomInt(0, 360)),
    funcs.degToRad(funcs.randomInt(0, 360)),
    0
  );

  gameState.smallEngine = true;

  setTimeout(() => {
    game.engine.resize();
  }, 100);

  tasksStore.showMinigame = true;

  // satellite.lookAt(earth.position);

  // setTimeout(() => {
  //   satellite.lookAt(earth.position);
  // }, 500);

  let orbitAngle = 0; // Initial angle in radians
  const orbitRadius = 110; // Distance from the Earth
  const orbitSpeed = 0.01; // Speed of rotation (radians per frame)

  const earthPosition = earth.position.clone(); // Earth's position

  game.scene.onBeforeRenderObservable.add(() => {
    const forward = new Vector3(0, 0, -1); // Local forward direction
    const worldMatrix = satellite.getWorldMatrix(); // Get the satellite's world matrix
    const globalForward = Vector3.TransformNormal(forward, worldMatrix); // Transform to global direction

    globalForward.normalize(); // Ensure the vector is normalized
    // Define the length of the raycast
    const rayLength = 120; // Adjust this value as needed

    // Calculate the end position
    const end = satellite.position.add(globalForward.scale(rayLength));

    const hasHitted = game.models?.ProjectRaycast({
      start: new Vector3(
        satellite.position.x,
        satellite.position.y,
        satellite.position.z
      ),
      end,
      debugDraw: true,
      debugTimeout: 20,
    }).hasHit!;

    if (dataStatus.beam_connected && !finaltaskStore.pointingEarth)
      dataStatus.beam_connected = false;
    if (dataStatus.beam_visible && !finaltaskStore.pointingEarth)
      dataStatus.beam_visible = false;

    if (!finaltaskStore.running) return;

    // Calculate the new position of the satellite
    const x = earthPosition.x + orbitRadius * Math.cos(orbitAngle);
    const z = earthPosition.z + orbitRadius * Math.sin(orbitAngle);
    const y = earthPosition.y; // Maintain the same height as Earth

    // Update the satellite's position
    satellite.position.set(x, y, z);

    //console.log(hasHitted);

    orbitAngle += orbitSpeed;

    if (hasHit != hasHitted) {
      hasHit = hasHitted;
      finaltaskStore.pointingEarth = hasHit; // idk if it will improve performance due to the fact that it is reactive
    }

    // Ensure the angle stays within a valid range
    if (orbitAngle > 2 * Math.PI) {
      orbitAngle -= 2 * Math.PI;
    }

    runCode("loop");
  });

  // Custom funcs
  function defineObjs() {
    jinter.defineObject("dataStatus", dataStatus);
    jinter.defineObject("Vector3", Vector3);
    jinter.defineObject("invertCoords", invertCoords);

    jinter.defineObject("block_lookAt", block_lookAt);
    jinter.defineObject("getEarthCoords", getEarthCoords);
    jinter.defineObject("getSunCoords", getSunCoords);
    jinter.defineObject("logToConsole", logToConsole);

    jinter.defineObject("transfer_packet", transfer_packet);

    jinter.defineObject("delay", doDelay);
  }
  defineObjs();

  function block_lookAt(vector: Vector3[]) {
    if (!vector[0]) return;
    satellite.lookAt(vector[0]);
  }
  function invertCoords(vector: Vector3[]) {
    if (!vector[0]) return new Vector3(100, 100, 100);
    return new Vector3(vector[0].x * -1, vector[0]?.y, vector[0].z * -1);
  }
  function logToConsole(data: any) {
    console.log(data[0]);
    finaltaskStore.addMessage(String(data[0]));
  }
  async function doDelay(amount: number[]) {
    if (!amount[0]) return;
    console.log(amount);
    await funcs.delay(amount[0]);
  }

  // ----------------

  function getEarthCoords() {
    if (!dataStatus.sensors_enabled) {
      foundErrors = true;
      finaltaskStore.addMessage("I sensori sono disattivati", true);
      return;
    }
    return earth.position;
  }
  function getSunCoords() {
    if (!dataStatus.sensors_enabled) {
      foundErrors = true;
      finaltaskStore.addMessage("I sensori sono disattivati", true);
      return;
    }
    return sun.position;
  }

  function transfer_packet() {
    if (!finaltaskStore.pointingEarth) {
      dataStatus.beam_connected = false;
      dataStatus.beam_visible = false;
      foundErrors = true;
      finaltaskStore.addMessage("Connessione con la Terra persa", true);
      return;
    }
    if (!dataStatus.beam_connected) {
      foundErrors = true;
      finaltaskStore.addMessage(
        "Nessuna connessione con il laser Terrestre",
        true
      );
      return;
    }
    if (dataStatus.packets_num <= 0) {
      foundErrors = true;
      finaltaskStore.addMessage("Nessun pacchetto da trasferire", true);
      return;
    }
    if (!dataStatus.communications_enabled) {
      if (dataStatus.packets_num <= 0) {
        foundErrors = true;
        finaltaskStore.addMessage(
          "Hardware di comunicazione disabilitato",
          true
        );
        return;
      }
    }
    dataStatus.packets_num -= 1 - Math.floor(game.engine.getDeltaTime() / 20);
  }
}
