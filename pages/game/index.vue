<script setup>
definePageMeta({
  layout: "game",
});

useHead({
  scripts: [{ src: "https://unpkg.com/focus-visible" }],
});

const showGame = ref(false);
const loading = useLoadingStore();
const config = useRuntimeConfig();

if (config.public.inDev) {
  loading.isLoading = true;
  showGame.value = true;
}
</script>

<template>
  <Button
    @click="
      loading.isLoading = true;
      showGame = true;
    "
    v-if="!showGame"
    >Avvia</Button
  >
  <Game v-else />
</template>
