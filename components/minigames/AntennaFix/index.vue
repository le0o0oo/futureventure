<script lang="ts" setup>
import { X } from "lucide-vue-next";

const cStep = ref(0);
const showModal = ref(true);

const tasksStore = useTasksStore();

function handleClose() {
  showModal.value = false;
  tasksStore.currentMinigame = "";
  tasksStore.showMinigame = false;
}
</script>

<template>
  <div
    class="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-background/80 z-50"
    ref="mainDiv"
    v-auto-animate
  >
    <Card class="max-w-7xl h-[80vh] w-full" v-if="showModal">
      <CardHeader class="px-6 pb-0">
        <CardTitle class="flex items-center gap-2" v-auto-animate>
          <div class="w-full">Ripara cavi</div>
          <Button
            v-if="cStep != 2"
            @click="
              showModal = false;
              tasksStore.currentMinigame = '';
              tasksStore.showMinigame = false;
            "
            >Chiudi<X
          /></Button>
        </CardTitle>
        <CardDescription>
          <Progress v-model="cStep" :max="2" class="my-3 w-full" />
        </CardDescription>
      </CardHeader>
      <CardContent class="h-[calc(100%-60px)]" v-auto-animate>
        <!-- Intro -->
        <template v-if="cStep === 0">
          <h2 class="font-bold text-xl">[WORK IN PROGRESS]</h2>
          <div class="flex w-full justify-center mt-4">
            <Button @click="cStep++" class="w-full max-w-lg">Inizia</Button>
            <Button @click="cStep++" class="w-full max-w-lg">Completa</Button>
          </div>
        </template>
      </CardContent>
    </Card>
  </div>
</template>

<style></style>
