<script setup lang="ts">
const route = useRoute();
</script>

<template>
  <div class="h-screen w-screen flex justify-center items-center">
    <NuxtLink to="/game">
      <button class="bg-blue-500 rounded-md p-4 px-6">Avvia gioco</button>
    </NuxtLink>
  </div>
</template>
