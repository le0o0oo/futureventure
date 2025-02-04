<script setup lang="ts">
import * as PIXI from "pixi.js";
import funcs from "~/utils/generalFuncs";

const content = ref();
const props = defineProps<{ diff: number }>();

const divisions = 10;
const diff = 50; // percentage

let app: PIXI.Application<PIXI.Renderer>;
let interval: NodeJS.Timeout;

onMounted(async () => {
  app = new PIXI.Application();
  await app.init({ resizeTo: content.value });
  const step = app.screen.width / divisions;

  // Then adding the application's canvas to the DOM body.
  content.value.appendChild(app.canvas);

  const graphics = new PIXI.Graphics();
  app.stage.addChild(graphics);

  let prevYCoord = 0;

  // app.ticker.add((time) => {
  //   //console.log("running");

  // });

  interval = setInterval(() => {
    const minY = (props.diff / 100) * (app.screen.height / 2);
    const maxY =
      app.screen.height - (props.diff / 100) * (app.screen.height / 2);
    graphics.clear();
    for (let i = 0; i <= divisions; i++) {
      graphics.moveTo(i * step - step, prevYCoord);
      prevYCoord = funcs.randomInt(minY, maxY);
      graphics.lineTo(i * step, prevYCoord);
    }
    graphics.stroke({ width: 3, color: 0x00ff00 });
  }, 150);
});

onBeforeUnmount(() => {
  clearInterval(interval);
  app.destroy(true);
});
</script>

<template>
  <div class="size-full h-[500px]" ref="content"></div>
</template>
