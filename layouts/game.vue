<script lang="ts" setup>
import { cn } from "@/lib/utils";
import "video.js/dist/video-js.css";
//@ts-ignore

import { Wrench, ClipboardList, Clock, Check } from "lucide-vue-next";
import { ref, onMounted, onUnmounted } from "vue";
import { eventBus } from "~/event-bus";

const isDev = ref(import.meta.dev);
const config = useRuntimeConfig();
const infoStore = useInfoStore();

const showdevtools = ref(config.public.inDev);

const tasksStore = useTasksStore();
const sharedData = useSharedData();

document.addEventListener("keydown", (event) => {
  if (event.key === "j" || event.key === "J") {
    showdevtools.value = !showdevtools.value;
  }
});

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

  switch (tasksStore.type) {
    case "traffic_light":
      tasksStore.currentMinigame = "traffic_light";
      break;
    case "cables_fix":
      tasksStore.currentMinigame = "cables_fix";
      break;
    case "drone_spawn":
      eventBus.dispatchEvent(new CustomEvent("to_drone"));
      if (sharedData.runAllScenes)
        eventBus.dispatchEvent(
          new CustomEvent("runScene", { detail: "to_drone" } as CustomEventInit)
        );
      break;
    case "broken_antenna_real":
      tasksStore.currentMinigame = "broken_antenna";
      break;
  }

  if (tasksStore.type != "drone_spawn") tasksStore.showMinigame = true;
}
</script>

<template>
  <div
    class="w-screen"
    :class="cn(showdevtools ? 'h-[calc(100vh-51.99px)]' : 'h-screen')"
  >
    <DevToolsNav v-if="showdevtools" />

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
            <div class="flex items-center mb-2 h-full gap-3">
              <div class="h-[48px]"><TaskTrackerIcon /></div>
              <div class="bottom-2 relative ml-2 leading-none text-left">
                <Badge variant="outline" class="p-1 px-2"
                  ><ClipboardList class="size-4 mr-1" />Task</Badge
                >
                <p>
                  {{
                    tasksStore.getTaskText(tasksStore.taskTracker.type)
                      ?.title_text
                  }}
                </p>
              </div>
            </div>
          </CardTitle>
          <CardDescription>
            <Button class="w-full" @click="doTask"
              ><Wrench class="size-5" />{{
                tasksStore.getTaskText(tasksStore.taskTracker.type)?.button_text
              }}
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
            <div class="flex items-center mb-2 gap-3 h-full">
              <div class="h-[48px]"><TaskTrackerIcon /></div>
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
                <p class="text-xl">
                  {{
                    tasksStore.getTaskText(tasksStore.taskTracker.type)
                      ?.title_text
                  }}
                </p>
              </div>
            </div>
          </CardTitle>
          <CardDescription class="text-left font-bold text-lg">
            {{
              tasksStore.getTaskText(tasksStore.taskTracker.type)?.tracker_text
            }}
          </CardDescription>
        </CardHeader>
      </Card>
    </Transition>

    <!-- End task tracker -->

    <!-- <    <div class="fixed top-20 left-2">
      <ToastSkeleton description="test text" />
    </div>> -->

    <LaserComm v-if="infoStore.showComponent" />
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
