<script lang="ts" setup>
import { Cable, SatelliteDish } from "lucide-vue-next";

const tasksStore = useTasksStore();
</script>

<template>
  <div class="w-[48px] h-full">
    <SvgoIconTrafficLight
      class="text-5xl"
      v-if="tasksStore.type == 'traffic_light'"
    />
    <Cable class="w-full h-full" v-else-if="tasksStore.type == 'cables_fix'" />
    <SatelliteDish
      class="w-full h-full"
      v-else-if="tasksStore.type == 'broken_antenna'"
    />
  </div>
</template>

<style></style>
