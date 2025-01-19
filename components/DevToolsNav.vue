<script lang="ts" setup>
import { devtools } from "~/stores/engine";
import { eventBus } from "~/event-bus";
import { cn } from "@/lib/utils";
import { buttonVariants } from "./ui/button";
import utilsMeshes from "~/utils/utilsMeshes";
import funcs from "~/utils/generalFuncs";
import type { FreeCamera } from "babylonjs";

const colorMode = useColorMode();
const sharedDataStore = useSharedData();
const generalData = useGeneralStore();

const openedModal = ref(false);
const infoStore = useInfoStore();

const game = utilsMeshes.game;

colorMode.preference = "dark";

function fixDevtools() {
  document.querySelectorAll(".numeric-input").forEach((element: any) => {
    element.style.backgroundColor = "black";
  });
}

function openGlbFile() {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".glb,.gltf";
  input.onchange = () => {
    //@ts-ignore
    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      eventBus.dispatchEvent(
        new CustomEvent("loadGLB", { detail: reader.result } as CustomEventInit)
      );
    };
    //@ts-ignore
    reader.readAsDataURL(file);
  };
  input.click();
}

function runSequence(seq: string) {
  openedModal.value = false;
  devtools.hide();
  eventBus.dispatchEvent(
    new CustomEvent("runScene", { detail: seq } as CustomEventInit)
  );
}

function toDrone() {
  eventBus.dispatchEvent(new CustomEvent("to_drone"));
  openedModal.value = false;
}

function toggleCameraFollow() {
  generalData.cameraFollow = !generalData.cameraFollow;

  if (!generalData.cameraFollow) {
    utilsMeshes.game
      ?.getCamera()
      ?.attachControl(utilsMeshes.game.canvasElement, true);
  } else {
    utilsMeshes.game?.getCamera()?.detachControl();

    (utilsMeshes.game?.getCamera() as FreeCamera).rotation.y =
      funcs.degToRad(180);
  }
}
</script>

<template>
  <div class="flex gap-1 p-2">
    <Button @click="devtools.toggle()">Toggle inspector</Button>
    <Button @click="fixDevtools()">Fix devtools</Button>
    <Button @click="openGlbFile()">Carica mappa (.glb)</Button>
    <Button @click="toggleCameraFollow()">Toggle camera follow</Button>
    <Dialog v-model:open="openedModal">
      <DialogTrigger :class="buttonVariants({ variant: 'default' })">
        Sequenze
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Sequenze</DialogTitle>
          <DialogDescription class="flex gap-2 flex-wrap">
            <Button
              @click="
                sharedDataStore.runAllScenes = true;
                runSequence('all');
              "
              >All</Button
            >
            <Button @click="runSequence('intro')">Intro</Button>
            <Button @click="runSequence('firstTask')">First task</Button>
            <Button @click="runSequence('second_task')">Second task</Button>
            <span>-</span>
            <Button @click="runSequence('basic_done')">Basic done</Button>
            <Button @click="toDrone">To drone</Button>
            <Button
              @click="
                toDrone();
                runSequence('to_drone');
              "
              >To drone (after)</Button
            >
            <span>-</span>
            <Button @click="runSequence('fixed_antenna')">Fixed antenna</Button>
            <Button @click="runSequence('new_map_first')">Nasa</Button>
            <Button @click="runSequence('final_task')">Final task</Button>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
    <Button
      @click="
        infoStore.showComponent = true;
        infoStore.show = !infoStore.show;
      "
      >toggle info store</Button
    >
  </div>
</template>

<style></style>
