<script lang="ts" setup>
import { devtools } from "~/stores/engine";
import { eventBus } from "~/event-bus";

const colorMode = useColorMode();

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
</script>

<template>
  <div class="flex gap-1 p-2">
    <Button @click="devtools.toggle()">Toggle inspector</Button>
    <Button @click="fixDevtools()">Fix devtools</Button>
    <Button @click="openGlbFile()">Carica mappa</Button>
  </div>
</template>

<style></style>
