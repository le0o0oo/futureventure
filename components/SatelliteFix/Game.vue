<script setup lang="ts">
import { javascriptGenerator } from "blockly/javascript";
import BlocklyComponent from "./Blockly/BlocklyComponent.vue";
import { eventBus } from "~/event-bus";

const blockly = ref();

const showTasks = ref(true);
const generalStore = useGeneralStore();
const finaltaskStore = useFinalTaskStore();

onMounted(async () => {
  const gameLogic = await import("./gameLogic");

  gameLogic.setBlocklyWorkspace(blockly.value.workspace);
});

function exportCode() {
  console.log(javascriptGenerator.workspaceToCode(blockly.value.workspace));
  eventBus.dispatchEvent(new Event("compail"));
}

function runCode(part: string) {
  eventBus.dispatchEvent(new CustomEvent("run_satellite", { detail: part }));
}

function serialize() {
  eventBus.dispatchEvent(new Event("serialize"));
}
</script>

<template>
  <div
    class="bg-background absolute z-[99] p-3 border-border border-2 rounded-lg bottom-2 left-4"
    v-auto-animate
    v-if="!finaltaskStore.inFinalTest"
  >
    <div v-if="showTasks" class="mb-3">
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
        Fai in modo che il satellite invii tutti i packets alla terra dalla
        memoria quando rileva il faro laser.
      </p>

      <p class="text-xl font-bold mt-3">> Gestione tempeste solari</p>

      <span class="text-lg mt-2">
        Quando una tempesta solare viene rilevata:
        <ul class="list-disc ml-8">
          <li>Disattiva tutti i sensori</li>
          <li>Disattiva hardware per comunicazione terrestre</li>
          <li>Interrompi eventuali trasferimenti in corso</li>
          <li>
            Ricordati che alla fine della tempesta il satellite deve puntare
            alla Terra!
          </li>
        </ul>
      </span>
    </div>
    <Button variant="outline" @click="showTasks = !showTasks">
      {{ !showTasks ? "Mostra" : "Nascondi" }} task
    </Button>
  </div>
  <div class="flex gap-2 items-center" v-if="!finaltaskStore.inFinalTest">
    <Button @click="exportCode()" v-if="generalStore.inDev">export code</Button>
    <Button @click="runCode('loop')" v-if="generalStore.inDev">run loop</Button>
    <Button @click="serialize()" v-if="generalStore.inDev">serialize</Button>
  </div>

  <div class="size-full" v-auto-animate>
    <BlocklyComponent
      id="blockly2"
      ref="blockly"
      v-show="!finaltaskStore.inFinalTest"
    ></BlocklyComponent>
    <SatelliteFixFinaltest v-if="finaltaskStore.inFinalTest" />
  </div>
</template>
