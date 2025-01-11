<script lang="ts" setup>
import { cn } from "@/lib/utils";
//@ts-ignore
import IconTrafficLight from "~/assets/icons/icon-traffic-light.svg";
import { Wrench, ClipboardList, Clock, Check } from "lucide-vue-next";
import { ref, onMounted, onUnmounted } from "vue";

const isDev = ref(import.meta.dev);
const config = useRuntimeConfig();

const tasksStore = useTasksStore();

const handleKeyPress = (event: KeyboardEvent) => {
  if (event.key.toLowerCase() === "x" && tasksStore.showMessage) doTask();
};
onMounted(() => {
  window.addEventListener("keydown", handleKeyPress);
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleKeyPress);
});

function doTask() {
  tasksStore.doingTask = true;
  tasksStore.showMessage = false;
  console.log("task");

  if (tasksStore.type == "traffic_light")
    tasksStore.currentMinigame = "traffic_light";
  tasksStore.showMinigame = true;
}
</script>

<template>
  <div
    class="w-screen"
    :class="cn(config.public.inDev ? 'h-[calc(100vh-51.99px)]' : 'h-screen')"
  >
    <DevToolsNav v-if="config.public.inDev" />

    <slot />

    <Minigames
      v-if="tasksStore.showMinigame"
      :minigame="tasksStore.currentMinigame"
    />

    <!-- Task prompt popup -->

    <Transition name="popup">
      <Card
        v-if="tasksStore.showMessage"
        class="w-96 fixed bottom-[100px] left-[calc(50%-12rem)]"
      >
        <CardHeader>
          <CardTitle>
            <div class="flex items-center mb-2">
              <IconTrafficLight class="text-5xl" />
              <div class="bottom-2 relative ml-2 leading-none text-left">
                <Badge variant="outline" class="p-1 px-2"
                  ><ClipboardList class="size-4 mr-1" />Task</Badge
                >
                <p>Ripara semaforo</p>
              </div>
            </div>
          </CardTitle>
          <CardDescription>
            <Button class="w-full" @click="doTask"
              ><Wrench class="size-5" />Ripara
              <kbd
                class="border-[1px] rounded-md px-2 shadow-2xl bg-secondary/30"
                >X</kbd
              >
            </Button>
          </CardDescription>
        </CardHeader>
      </Card>
    </Transition>

    <!-- End prompt task popup -->

    <!-- Task tracker -->

    <Transition name="popup">
      <Card v-if="tasksStore.taskTracker.show" class="w-96 fixed top-4 right-4">
        <CardHeader>
          <CardTitle>
            <div class="flex items-center mb-2">
              <IconTrafficLight class="text-5xl" />
              <div class="relative ml-2 leading-none text-left">
                <div class="flex items-center gap-2" v-auto-animate>
                  <Badge variant="outline" class="p-1 px-2"
                    ><ClipboardList class="size-4 mr-1" />Task</Badge
                  >
                  <Badge
                    variant="secondary"
                    v-if="!tasksStore.taskTracker.completed"
                  >
                    <Clock class="size-4 mr-2" />In attesa
                  </Badge>
                  <Badge class="bg-green-700 text-white" v-else>
                    <Check class="size-4 mr-2" />Completato
                  </Badge>
                </div>
                <p class="text-xl">Ripara semaforo</p>
              </div>
            </div>
          </CardTitle>
          <CardDescription class="text-left font-bold text-lg">
            Segui la direzione della freccia
          </CardDescription>
        </CardHeader>
      </Card>
    </Transition>

    <!-- End task tracker -->

    <!-- <    <div class="fixed top-20 left-2">
      <ToastSkeleton description="test text" />
    </div>> -->
  </div>
</template>

<style scoped>
.popup-enter-active,
.popup-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}
.popup-enter-from,
.popup-leave-to {
  transform: scale(0.9);
  opacity: 0;
}
.popup-enter-to,
.popup-leave-from {
  transform: scale(1);
  opacity: 1;
}
</style>
