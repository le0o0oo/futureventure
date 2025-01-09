<script lang="ts" setup>
import * as Blockly from "blockly/core";
import BlocklyComponent from "./Blockly/BlocklyComponent.vue";
import { javascriptGenerator } from "blockly/javascript";
import { Triangle, Loader2, RotateCcw } from "lucide-vue-next";
import { cn } from "@/lib/utils";
import { toast } from "vue-sonner";
import assistant from "~/utils/assistant";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const foo = ref();

const generatedCode = ref("");

const lighStatus = ref({
  red: false,
  yellow: false,
  green: false,
});
const runningState = ref<"idle" | "running" | "stopped">("idle");
const currentMaxDelay = ref(1);
const currentDelayProgress = ref(0);

const gameState = useGameStateStore();

const validate = {
  red: false,
  yellow: false,
  green: false,

  redAmount: 0,
  yellowAmount: 0,
  greenAmount: 0,
};

onMounted(async () => {
  foo.value.workspace.addChangeListener((event: any) => {
    if (event.type == "viewport_change") return;
    //console.log(event);
    generatedCode.value = javascriptGenerator.workspaceToCode(
      foo.value.workspace
    );
    // .replaceAll("  ", "");
    // console.log(code);
  });

  if (gameState.dialogs.traffic_light.blocks == false) {
    gameState.dialogs.traffic_light.blocks = true;
    assistant.say("Ecco qua: l'editor a blocchi!", {
      duration: 4000,
    });
    await delay(3000);
    assistant.say(
      'Segui le indicazioni che trovi nella schema in basso "Indicazioni"',
      {
        duration: 6000,
      }
    );
    await delay(6500);
    assistant.say(
      'Inizia un po\' a programmare, e quando hai creato il codice clicca su "Compila e testa"',
      {
        duration: 7000,
      }
    );
    await delay(6500);
    assistant.say(
      'Solo per questa volta hai una categoria "Preset" con il compito già svolto',
      {
        duration: 5000,
      }
    );
    await delay(4500);
    assistant.say('Quando hai finito clicca "Avanti" in alto a destra', {
      duration: 4000,
    });
  }
});

function checkIfCorrect() {
  let passed = true;
  if (!validate.red || validate.redAmount != 10) passed = false;
  else if (!validate.green || validate.greenAmount != 10) passed = false;
  else if (!validate.yellow || validate.yellowAmount != 5) passed = false;

  return passed;
}

function reset() {
  lighStatus.value.red = false;
  lighStatus.value.yellow = false;
  lighStatus.value.green = false;

  currentDelayProgress.value = 0;
  currentMaxDelay.value = 1;

  runningState.value = "idle";

  validate.red = false;
  validate.green = false;
  validate.yellow = false;
  validate.redAmount = 0;
  validate.greenAmount = 0;
  validate.yellowAmount = 0;
}

async function compileCode() {
  if (runningState.value == "running") return;
  runningState.value = "running";

  const state = Blockly.serialization.workspaces.save(foo.value.workspace);

  const updateCode = `START {
  SPAWN thread2;
  th thread2 LOOP {
    res = NET https://update-server.example.com/check -h "Version: 1.0" -h "Authorization: Bearer xxxxx";
    IF res == "update" {
      new_bin = NET https://update-server.example.com -h "Version: 1.0" -h "Authorization: Bearer xxxxx";
      UPDATE new_bin;
    }
    ELSE {
      DELAY 360 sec;
    }
  }
}`;
  const pureCode = generatedCode.value
    .replaceAll(updateCode, "")
    .replaceAll("  ", "")
    .replaceAll("\n\n", "")
    .replace("LOOP {", "")
    .replace("}", "")
    .replaceAll("\n", "");

  const instructions = pureCode.split(";");

  // console.log(instructions);

  for (const line in instructions) {
    const tokens = instructions[line]!.split(" ");

    if (tokens[0] == "LIGHT") {
      //@ts-ignore
      if (tokens[1] == "on") lighStatus.value[tokens[2]] = true;
      //@ts-ignore
      else lighStatus.value[tokens[2]] = false;
    } else if (tokens[0] == "DELAY") {
      currentMaxDelay.value = Number(tokens[1]);
      currentDelayProgress.value = Number(tokens[1]);
      if (
        lighStatus.value.red &&
        !lighStatus.value.green &&
        !lighStatus.value.yellow
      ) {
        validate.red = true;
        validate.redAmount += Number(tokens[1]);
      } else if (
        !lighStatus.value.red &&
        lighStatus.value.green &&
        !lighStatus.value.yellow
      ) {
        validate.green = true;
        validate.greenAmount += Number(tokens[1]);
      } else if (
        !lighStatus.value.red &&
        !lighStatus.value.green &&
        lighStatus.value.yellow
      ) {
        validate.yellow = true;
        validate.yellowAmount += Number(tokens[1]);
      }

      await delay(100);
      for (let i = Number(tokens[1]); i > 0; i--) {
        currentDelayProgress.value--;
        await delay(100);
      }
    }
  }

  if (checkIfCorrect()) {
    gameState.minigames.traffic_light.fixed_code.status = true;
    if (generatedCode.value.includes("SPAWN thread2"))
      gameState.minigames.traffic_light.implemented_updates.status = true;

    if (!gameState.minigames.traffic_light.implemented_updates.status) {
      toast.success(
        "Codice è corretto! Pro tip: Implementa gli aggiornamenti per punteggo massimo",
        {
          position: "top-right",
        }
      );
    } else {
      toast.success("Codice è ✨ PERFETTO!", {
        position: "top-right",
      });
    }
  } else {
    toast.error("Uh oh! C'è un problema con il tuo codice", {
      position: "top-right",
    });
  }
  runningState.value = "stopped";
}
</script>

<template>
  <div class="w-full h-full max-h-[calc(100%-65px)]">
    <span class="font-bold text-lg">Riprogramma il processore</span>
    <div class="flex items-center h-full gap-2">
      <div class="w-[75%] h-full">
        <BlocklyComponent id="blockly2" ref="foo"></BlocklyComponent>
      </div>
      <div class="h-full w-[calc(100%-75%)] flex flex-col gap-2">
        <Button
          @click="runningState == 'idle' ? compileCode() : reset()"
          :disabled="runningState == 'running'"
          ><span
            class="w-full flex items-center justify-center gap-1"
            v-if="runningState == 'idle'"
            >Compila e testa <Triangle class="rotate-90"
          /></span>
          <span
            class="w-full flex items-center justify-center gap-1"
            v-else-if="runningState == 'running'"
            >In esecuzione <Loader2 class="animate-spin"
          /></span>
          <span
            class="w-full flex items-center justify-center gap-1"
            v-else-if="runningState == 'stopped'"
            >Reimposta stato <RotateCcw
          /></span>
        </Button>

        <div class="flex items-center gap-1">
          <Progress
            :model-value="currentDelayProgress"
            :max="currentMaxDelay"
          />
          <span
            v-text="currentMaxDelay"
            class="text-sm"
            v-if="runningState == 'running'"
          ></span>
        </div>

        <div class="h-full w-full flex justify-center items-center">
          <div
            class="border-2 border-secondary p-2 rounded-md flex flex-col gap-3"
          >
            <div
              class="size-10 rounded-full border-red-600 border-2"
              :class="cn(lighStatus.red && 'bg-red-600')"
            ></div>
            <div
              class="size-10 rounded-full border-yellow-600 border-2"
              :class="cn(lighStatus.yellow && 'bg-yellow-600')"
            ></div>
            <div
              class="size-10 rounded-full border-green-600 border-2"
              :class="cn(lighStatus.green && 'bg-green-600')"
            ></div>
          </div>
        </div>
        <div class="max-h-[50%] w-full">
          <Tabs default-value="account" class="w-full max-w-full">
            <TabsList class="max-w-full w-full">
              <TabsTrigger class="w-full" value="account">
                Indicazioni
              </TabsTrigger>
              <TabsTrigger class="w-full" value="password">
                Codice
              </TabsTrigger>
            </TabsList>
            <TabsContent value="account">
              <pre
                style="white-space: pre-wrap"
                class="overflow-auto h-[29vh] max-h-[29vh]"
              >
Durata del 🔴 ROSSO: 10s
Durata del 🟢 VERDE: 10s
Durata del 🟡 GIALLO: 5s

INIZIARE CON IL 🔴 ROSSO!

Implementare anche gli aggiornamenti automatici se possibile
</pre
              >
            </TabsContent>
            <TabsContent value="password">
              <pre
                v-text="generatedCode"
                class="overflow-auto h-[29vh] max-h-[29vh]"
              ></pre>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  </div>
</template>

<style></style>
