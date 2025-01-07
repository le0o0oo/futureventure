<script lang="ts" setup>
import { cn } from "@/lib/utils";
import IconTrafficLight from "~/assets/icons/icon-traffic-light.svg";
import { Wrench, ClipboardList } from "lucide-vue-next";

const isDev = ref(import.meta.dev);
const config = useRuntimeConfig();

const tasksStore = useTasksStore();
</script>

<template>
  <div
    class="w-screen"
    :class="cn(config.public.inDev ? 'h-[calc(100vh-51.99px)]' : 'h-screen')"
  >
    <DevToolsNav v-if="config.public.inDev" />

    <slot />

    <Transition name="popup">
      <div
        class="fixed bottom-[100px] left-0 w-full text-center flex justify-center"
        v-if="tasksStore.showMessage"
      >
        <Card>
          <CardHeader>
            <CardTitle>
              <div class="flex items-center mb-2">
                <IconTrafficLight class="text-5xl" />
                <div class="bottom-2 relative ml-2 leading-none text-left">
                  <Badge variant="outline" class="p-1 px-2"
                    ><ClipboardList class="size-4 mr-1" />Task</Badge
                  >
                  <p>Aggiusta semaforo</p>
                </div>
              </div>
            </CardTitle>
            <CardDescription>
              <Button class="w-full"><Wrench class="size-5" />Aggiusta</Button>
            </CardDescription>
          </CardHeader>
        </Card>
      </div></Transition
    >
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
