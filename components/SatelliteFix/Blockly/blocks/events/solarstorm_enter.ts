import * as Blockly from "blockly/core";
import { javascriptGenerator } from "blockly/javascript";

Blockly.common.defineBlocks({
  solarstorm_enter: {
    init: function () {
      this.appendDummyInput("").appendField(
        "Quando entra in una tempesta solare"
      );
      this.appendStatementInput("actions");
      this.setTooltip(
        "Esegue del codice quado il satellite rileva una tempesta solare"
      );
      this.setHelpUrl("");
      this.setColour("#d1b502");

      this.setDeletable(false);
      this.setEditable(false);
    },
  },
});

javascriptGenerator.forBlock["solarstorm_enter"] = function (block, generator) {
  const statement_actions = generator.statementToCode(block, "actions");

  const code = `function solarstorm_enter() {
${statement_actions}}\n`;
  return code;
};
