import * as Blockly from "blockly/core";
import { javascriptGenerator } from "blockly/javascript";

Blockly.common.defineBlocks({
  solarstorm_leave: {
    init: function () {
      this.appendDummyInput("").appendField(
        "Quando esce da una tempesta solare"
      );
      this.appendStatementInput("actions");
      this.setTooltip(
        "Esegue del codice quado il satellite rileva una tempesta solare"
      );
      this.setHelpUrl("");
      this.setColour("#b8a111");

      this.setDeletable(false);
      this.setEditable(false);
    },
  },
});

javascriptGenerator.forBlock["solarstorm_leave"] = function (block, generator) {
  const statement_actions = generator.statementToCode(block, "actions");

  const code = `function solarstorm_leave() {
${statement_actions}}\n`;
  return code;
};
