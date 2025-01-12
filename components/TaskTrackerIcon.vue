<script lang="ts" setup>
import { Cable } from "lucide-vue-next";

const tasksStore = useTasksStore();
</script>

<template>
  <div class="w-[48px] h-full">
    <SvgoIconTrafficLight
      class="text-5xl"
      v-if="tasksStore.type == 'traffic_light'"
    />
    <Cable class="w-full h-full" v-else-if="tasksStore.type == 'cables_fix'" />
  </div>
</template>

<style></style>
