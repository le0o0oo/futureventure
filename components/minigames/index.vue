<script lang="ts" setup>
import { type minigameType } from "#build/imports";
import utilsMeshes from "~/utils/utilsMeshes";

const showgames = ref(true);
const tasksStore = useTasksStore();

interface Props {
  minigame: minigameType;
}

defineProps<Props>();

onBeforeUnmount(() => {
  showgames.value = false;
  utilsMeshes.game?.canvasElement.focus();
});
</script>

<template>
  <MinigamesTrafficLight v-if="minigame == 'traffic_light' && showgames" />
  <MinigamesCablesFix v-else-if="minigame == 'cables_fix' && showgames" />
  <MinigamesAntennaFix v-else-if="minigame == 'broken_antenna' && showgames" />
</template>

<style></style>
