<script lang="ts" setup>
import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "vue";

const props = defineProps<{
  class?: HTMLAttributes["class"];
}>();

function colourRandom() {
  var num = Math.floor(Math.random() * Math.pow(2, 24));
  return "#" + ("00000" + num.toString(16)).substr(-6);
}

const color = colourRandom();
</script>
<template>
  <button
    @click="$emit('press')"
    :class="
      cn(
        'w-full outline-secondary border-2 border-transparent hover:border-border p-2 transition-colors rounded-md cursor-pointer',
        props.class
      )
    "
  >
    <div class="flex items-center w-full">
      <div
        class="size-[30px] bg-gradient-to-l from-neutral-400 to-background border-black border-2 border-l-0"
      ></div>
      <div
        class="w-full h-[20px] flex justify-center"
        :style="{ backgroundColor: color }"
      >
        <div
          class="w-[calc(100%-20px)] bg-white h-[5px] relative top-1 rounded-full"
          style="filter: blur(0.2rem)"
        ></div>
      </div>

      <img src="/wires_broken.png" class="w-[100px]" />

      <div
        class="w-full h-[20px] flex justify-center"
        :style="{ backgroundColor: color }"
      >
        <div
          class="w-[calc(100%-20px)] bg-white h-[5px] relative top-1 rounded-full"
          style="filter: blur(0.2rem)"
        ></div>
      </div>
      <div
        class="size-[30px] bg-gradient-to-r from-neutral-400 to-background border-black border-2 border-r-0"
      ></div>
    </div>
  </button>
</template>

<style></style>
