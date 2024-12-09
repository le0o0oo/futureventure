<script setup>
definePageMeta({
  layout: "game",
});

const showGame = ref(false);

if (import.meta.dev) showGame.value = true;
</script>

<template>
  <Button @click="showGame = true" v-if="!showGame">Avvia</Button>
  <Game v-else />
</template>
