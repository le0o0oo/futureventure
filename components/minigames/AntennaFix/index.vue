<script lang="ts" setup>
import { X } from "lucide-vue-next";
import { eventBus } from "~/event-bus";

const cStep = ref(0);
const showModal = ref(true);

const tasksStore = useTasksStore();
const sharedData = useSharedData();

function handleClose() {
  showModal.value = false;
  tasksStore.currentMinigame = "";
  tasksStore.showMinigame = false;
}

function finished() {
  showModal.value = false;
  tasksStore.currentMinigame = "";
  tasksStore.showMinigame = false;
  tasksStore.clearTasks();

  if (sharedData.runAllScenes)
    setTimeout(() => {
      eventBus.dispatchEvent(
        new CustomEvent("runScene", {
          detail: "fixed_antenna",
        } as CustomEventInit)
      );
    }, 3000);
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
          <Progress v-model="cStep" :max="3" class="my-3 w-full" />
        </CardDescription>
      </CardHeader>
      <CardContent class="h-[calc(100%-60px)]" v-auto-animate>
        <!-- Intro -->
        <template v-if="cStep === 0">
          <h2 class="font-bold text-xl">
            Seleziona la frequenza ideale per i droni e calibra l'antenna
            normalizzando il segnale ad essa
          </h2>
          <div class="flex w-full justify-center mt-4">
            <Button @click="cStep++" class="w-full max-w-lg">Inizia</Button>
            <!-- <Button @click="finished" class="w-full max-w-lg">Completa</Button> -->
          </div>
        </template>

        <!-- frequency selector -->
        <MinigamesAntennaFixStep1 v-else-if="cStep === 1" @done="cStep++" />

        <!-- Frequency tuner -->
        <MinigamesAntennaFixStep2 v-else-if="cStep === 2" @next="cStep++" />

        <!-- Result -->
        <MinigamesAntennaFixStep3 v-else-if="cStep === 3" />
      </CardContent>
    </Card>
  </div>
</template>

<style></style>
