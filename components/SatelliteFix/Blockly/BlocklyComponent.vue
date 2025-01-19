<script setup>
import { onMounted, ref, shallowRef } from "vue";
import * as Blockly from "blockly/core";
import * as It from "blockly/msg/it";
import DarkTheme from "@blockly/theme-dark";
import "blockly/blocks";
import "./blocks";
import "~/custom_category";
import categories from "./categories";
import "@blockly/toolbox-search";

const initialState = {
  blocks: {
    languageVersion: 0,
    blocks: [
      {
        type: "satellite_forever",
        x: 38,
        y: 188,
      },
      {
        type: "on_beam_detect",
        x: 388,
        y: 188,
      },
      {
        type: "solarstorm_enter",
        x: 38,
        y: 413,
      },
      {
        type: "solarstorm_leave",
        x: 388,
        y: 413,
      },
    ],
  },
};

const blocklyToolbox = ref();
const blocklyDiv = ref();
const workspace = shallowRef();

defineExpose({ workspace });

onMounted(() => {
  Blockly.setLocale(It);
  const options = {
    media: "https://blockly-demo.appspot.com/static/media/",
    theme: DarkTheme,
    renderer: "zelos",
    grid: {
      spacing: 25,
      length: 3,
      colour: "#ccc",
      snap: true,
    },
    toolbox: categories,
  };
  workspace.value = Blockly.inject(blocklyDiv.value, options);
  workspace.value.addChangeListener(Blockly.Events.disableOrphans);

  Blockly.serialization.workspaces.load(initialState, workspace.value);
});

onBeforeUnmount(() => {
  workspace.value?.dispose();
});
</script>

<template>
  <div class="size-full">
    <div class="blocklyDiv rounded-md" ref="blocklyDiv"></div>
  </div>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.blocklyDiv {
  height: 100%;
  width: 100%;
  text-align: left;
}
</style>
