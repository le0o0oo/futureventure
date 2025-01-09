<script setup lang="ts">
const tasksStore = useTasksStore();

const showModal = ref(false);

onMounted(() => {
  showModal.value = true;
});

onBeforeUnmount(() => {
  showModal.value = false;
  tasksStore.currentMinigame = "";
});
</script>

<template>
  <Dialog v-model:open="showModal">
    <DialogContent class="max-w-5xl">
      <DialogHeader>
        <DialogTitle>Ripara semaforo</DialogTitle>
        <DialogDescription> </DialogDescription>
      </DialogHeader>
    </DialogContent>
  </Dialog>
</template>
