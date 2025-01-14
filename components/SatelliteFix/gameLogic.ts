import type Engine from "~/components/gameLogic/Engine";
import { Observer, Scene, Vector3, type FreeCamera } from "babylonjs";
import funcs from "~/utils/generalFuncs";
import assistant from "~/utils/assistant";
import utilsMeshes from "~/utils/utilsMeshes";
import { eventBus } from "~/event-bus";
import * as Blockly from "blockly";
import { javascriptGenerator } from "blockly/javascript";

let blocklyWorkspace: Blockly.WorkspaceSvg;

let instructionsCache = [] as any[];
let generatedCode: string;
let pureCode: string;
let recompile = true;
let instructions: string[];

export function setBlocklyWorkspace(workspace: Blockly.WorkspaceSvg) {
  blocklyWorkspace = workspace;

  blocklyWorkspace.addChangeListener((event) => {
    if (
      event.type == "viewport_change" ||
      event.type == "click" ||
      event.type == "move" ||
      event.type == "toolbox_item_select" ||
      event.type == "selected" ||
      event.type == "drag"
    )
      return;
    recompile = true;
  });
}

async function run() {
  const game = utilsMeshes.game!;
  const camera = game.getCamera() as FreeCamera;
  const gameState = useGameStateStore();
  const tasksStore = useTasksStore();
  const finaltaskStore = useFinalTaskStore();

  let hasHit = false;

  function ranInt(min: number, max: number) {
    if (min > max) {
      throw new Error("Min should not be greater than Max");
    }
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  async function compileCode() {
    if (!blocklyWorkspace) return;
    if (recompile) {
      generatedCode = javascriptGenerator.workspaceToCode(blocklyWorkspace);
      pureCode = generatedCode
        .replaceAll("  ", "")
        .replaceAll("\n\n", "")
        .replace("LOOP {", "")
        .replace("}", "")
        .replaceAll("\n", "");
      instructions = pureCode.split(";");
    }
    recompile = false;

    // console.log(instructions);

    for (const line in instructions) {
      const tokens = instructions[line]!.split(" ");

      if (tokens[0] == "DELAY") {
        await funcs.delay(Number(tokens[1]) * 1000);
      } else if (tokens[0] == "LOOK_AT") {
        if (tokens[1] == "(EARTH_COORDS)") satellite.lookAt(earth.position);
      }
    }
  }

  camera.position = new Vector3(5.267, 3.984, -6.074);
  camera.rotation = new Vector3(
    funcs.degToRad(8.62),
    funcs.degToRad(273.89),
    0
  );

  game.setSkybox("skybox_space/skybox_space");

  game.models?.ClearMap();

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
    funcs.degToRad(ranInt(0, 360)),
    funcs.degToRad(ranInt(0, 360)),
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
    const rayLength = 150; // Adjust this value as needed

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

    compileCode();
  });
}

run();
