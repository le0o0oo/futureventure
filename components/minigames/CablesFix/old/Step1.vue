<script lang="ts" setup>
import WorkingCable from "../comps/WorkingCable.vue";
import BrokenCable from "../comps/BrokenCable.vue";

function getRandomIntegerInRange(min: number, max: number) {
  if (min > max) {
    throw new Error("Min should not be greater than Max");
  }
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const brokenIndex = getRandomIntegerInRange(1, 5);
</script>

<template>
  <span class="font-bold text-xl">Seleziona il cavo danneggiato</span>
  <Separator class="my-5" />
  <div class="h-full flex items-center w-full mt-10 flex-col gap-10">
    <template v-for="i in 5">
      <WorkingCable v-if="i != brokenIndex" />
      <BrokenCable @press="$emit('pass')" v-else />
    </template>
  </div>
</template>

<style></style>
