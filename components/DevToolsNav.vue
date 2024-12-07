<script lang="ts" setup>
import { devtools } from "~/stores/engine";

function fixDevtools() {
  document.querySelectorAll(".numeric-input").forEach((element: any) => {
    element.style.backgroundColor = "black";
  });
}
</script>

<template>
  <div class="flex gap-1 p-2">
    <Button @click="devtools.toggle()">Toggle inspector</Button>
    <Button @click="fixDevtools()">Fix devtools</Button>
  </div>
</template>

<style></style>
