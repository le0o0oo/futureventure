<script lang="ts" setup>
import { type minigameType } from "#build/imports";

const showgames = ref(true);

interface Props {
  minigame: minigameType;
}

defineProps<Props>();

onBeforeUnmount(() => {
  showgames.value = false;
});
</script>

<template>
  <MinigamesTrafficLight v-if="minigame == 'traffic_light' && showgames" />
</template>

<style></style>
