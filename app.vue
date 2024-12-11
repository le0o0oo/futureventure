<script setup lang="ts">
const loading = useLoadingStore();
</script>

<template>
  <div class="w-screen h-screen">
    <NuxtLoadingIndicator />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>

  <transition name="fade-slow">
    <div
      v-if="loading.isLoading"
      class="absolute inset-0 z-50 flex flex-col items-center justify-center w-full h-full gap-10 bg-background"
    >
      <p class="animate-pulse text-3xl font-bold">Caricamento</p>
      <!-- <div
        class="flex items-center justify-center w-full"
        v-if="loading.progress.show"
      >
        <Progress
          :model-value="loading.progress.value"
          :max="loading.progress.max"
          class="max-w-[200px] h-[10px]"
        />
      </div> -->
    </div></transition
  >
</template>
