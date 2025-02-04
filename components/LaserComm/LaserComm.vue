<script lang="ts" setup>
import { Info, Pause, Play, ExternalLink } from "lucide-vue-next";
import { buttonVariants } from "../ui/button";
import { cn } from "@/lib/utils";

const infoStore = useInfoStore();

const steps = ref<{ id: number; component: any }[]>([]);

const comps = 10;
let interval: NodeJS.Timeout;

onMounted(async () => {
  for (let i = 1; i <= comps; i++) {
    steps.value.push({
      id: i,
      component: markRaw(
        defineAsyncComponent(
          () => import(/* webpackChunkName: "Step" */ `./Step${i}.vue`)
        )
      ),
    });
  }
});

interval = setInterval(() => {
  if (
    infoStore.progress.slideshowPlaying &&
    infoStore.progress.progressState > 0
  ) {
    if (infoStore.progress.progressState - infoStore.progress.rate >= 0)
      infoStore.progress.progressState -= infoStore.progress.rate;
    else infoStore.progress.progressState = 0;
  }
}, 100);

onBeforeUnmount(() => {
  clearInterval(interval);
});
</script>

<template>
  <Dialog v-model:open="infoStore.show">
    <DialogContent
      class="max-w-5xl [&>button]:hidden"
      @escape-key-down.prevent
      @pointer-down-outside.prevent
    >
      <DialogHeader>
        <DialogTitle class="flex items-center gap-2">
          <Info class="text-blue-600" /> Comunicazione laser
        </DialogTitle>
        <div class="flex items-center gap-3" v-auto-animate>
          <Progress
            :model-value="infoStore.progress.progressState"
            class="my-3"
          />
          <Button
            v-if="!infoStore.progress.slideshowPlaying"
            @click="
              infoStore.progress.slideshowPlaying =
                !infoStore.progress.slideshowPlaying
            "
          >
            <Play />
          </Button>
          <Button
            v-else
            @click="
              infoStore.progress.slideshowPlaying =
                !infoStore.progress.slideshowPlaying
            "
          >
            <Pause />
          </Button>
        </div>

        <DialogDescription class="w-full" v-auto-animate>
          <NuxtLink
            v-if="infoStore.slideState >= 3"
            :class="cn(buttonVariants({ variant: 'secondary' }), 'w-full my-2')"
            to="https://youtu.be/MEXXI0j4Bz8?si=zPDGCi5H2q9g2u0s"
            :external="true"
            target="_blank"
            >Fonte dati: TNO <ExternalLink
          /></NuxtLink>

          <component :is="steps[infoStore.slideState - 1]?.component || null" />
        </DialogDescription>
      </DialogHeader>
    </DialogContent>
  </Dialog>
</template>

<style></style>
