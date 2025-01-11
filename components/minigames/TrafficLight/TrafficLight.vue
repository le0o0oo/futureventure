<script setup lang="ts">
import { eventBus } from "~/event-bus";
import { ArrowRight, X } from "lucide-vue-next";
import { buttonVariants } from "~/components/ui/button";

const tasksStore = useTasksStore();
const gameState = useGameStateStore();

const showModal = ref(false);

const cStep = ref(0);

const showQuitModal = ref(false);

onMounted(() => {
  showModal.value = true;

  eventBus.dispatchEvent(
    new CustomEvent("runScene", { detail: "traffic_light" } as CustomEventInit)
  );
});

onBeforeUnmount(() => {
  showModal.value = false;
  tasksStore.currentMinigame = "";
});

function finished() {}
</script>

<template>
  <div
    class="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-background/80 z-50"
    v-auto-animate
  >
    <Card class="max-w-7xl h-[80vh] w-full" v-if="showModal">
      <CardHeader class="px-6 pb-0">
        <CardTitle class="flex items-center gap-2" v-auto-animate>
          <div class="w-full">Ripara semaforo</div>
          <Button
            @click="
              showModal = false;
              tasksStore.currentMinigame = '';
              tasksStore.showMinigame = false;
            "
            >Chiudi<X
          /></Button>
          <Button
            v-if="
              cStep == 2 && !gameState.minigames.traffic_light.fixed_code.status
            "
            @click="showQuitModal = true"
            >Salta<ArrowRight
          /></Button>
          <Button
            v-else-if="
              cStep == 2 && gameState.minigames.traffic_light.fixed_code.status
            "
            @click="cStep++"
            >Avanti <ArrowRight
          /></Button>
        </CardTitle>
        <CardDescription>
          <Progress v-model="cStep" :max="3" class="my-3 w-full" />
        </CardDescription>
      </CardHeader>
      <CardContent class="h-[calc(100%-60px)]">
        <!-- Intro -->
        <template v-if="cStep === 0">
          <h2 class="font-bold text-xl">
            Il microcontrollore di questo semaforo è difettoso e si è
            danneggiato.<br />Sostituiscilo e carica il nuovo codice
          </h2>
          <div class="flex w-full justify-center mt-4">
            <Button @click="cStep++" class="w-full max-w-lg">Inizia</Button>
          </div>
        </template>
        <MinigamesTrafficLightStep1 v-else-if="cStep === 1" @next="cStep++" />
        <MinigamesTrafficLightStep2
          v-else-if="cStep === 2"
          @next="finished()"
        />
        <MinigamesTrafficLightStep3 v-else-if="cStep === 3" />
      </CardContent>
    </Card>

    <AlertDialog v-bind:open="showQuitModal">
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Sei sicuro?</AlertDialogTitle>
          <AlertDialogDescription> Perderai XP </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel @click="showQuitModal = false"
            >Annulla</AlertDialogCancel
          >
          <AlertDialogAction
            :class="buttonVariants({ variant: 'destructive' })"
            @click="
              cStep++;
              showQuitModal = false;
            "
            >Continua</AlertDialogAction
          >
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </div>
</template>
