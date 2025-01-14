<template>
  <div class="fixed w-full top-0 left-0 p-4 z-50">
    <div
      class="px-1 flex items-center rounded-2xl backdrop-blur-2xl bg-white/30"
    >
      <div class="flex items-center">
        <NuxtLink to="/" class="flex items-center">
          <img src="/icon.png" class="h-20" />
          <h3 class="font-bold text-3xl">FutureVenture</h3></NuxtLink
        >
      </div>
      <div class="flex w-full justify-end pr-5 gap-3">
        <NuxtLink to="/" class="linkNav">Home</NuxtLink>
        <NuxtLink to="/credits" class="linkNav">Crediti</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup></script>

<style scoped>
.linkNav {
  @apply p-3 hover:bg-white/30 hover:backdrop-blur-2xl rounded-full transition-all px-5;
}
</style>
