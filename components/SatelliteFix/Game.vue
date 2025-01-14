<script setup lang="ts">
import { javascriptGenerator } from "blockly/javascript";
import BlocklyComponent from "./Blockly/BlocklyComponent.vue";

const blockly = ref();

const showTasks = ref(true);

onMounted(async () => {
  const gameLogic = await import("./gameLogic");

  gameLogic.setBlocklyWorkspace(blockly.value.workspace);
});

function exportCode() {
  console.log(javascriptGenerator.workspaceToCode(blockly.value.workspace));
}
</script>

<template>
  <div
    class="bg-background absolute z-50 p-3 border-border border-2 rounded-lg top-2 right-2"
    v-auto-animate
  >
    <Button variant="outline" @click="showTasks = !showTasks">
      {{ !showTasks ? "Mostra" : "Nascondi" }} task
    </Button>
    <div v-if="showTasks">
      <h1 class="font-bold text-4xl text-center">Task finale</h1>
      <Separator class="my-4" />
      <p class="text-xl font-bold">
        > Fai in modo che il satellite mantenga orientamento con la Terra.
      </p>

      <p class="text-lg mt-2">
        La retta evidenziata di colore rosso indica dove sta puntando il
        satellite. <br />
        In basso a destra puoi accedere ad altri dati che ti possono essere
        utili.
      </p>

      <p class="text-xl font-bold mt-3">> Gestione trasferimento dati</p>

      <p class="text-lg mt-2">
        Fai in modo che il satellite risponda con i dati corretti quando riceve
        un "faro laser"
      </p>
    </div>
  </div>
  <Button @click="exportCode()">export code</Button>
  <BlocklyComponent id="blockly2" ref="blockly"></BlocklyComponent>
</template>
