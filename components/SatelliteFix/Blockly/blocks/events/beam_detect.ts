import * as Blockly from "blockly/core";
import { javascriptGenerator } from "blockly/javascript";

Blockly.common.defineBlocks({
  on_beam_detect: {
    init: function () {
      this.appendDummyInput("").appendField("Quando un faro viene rilevato");
      this.appendStatementInput("actions");
      this.setTooltip("Esegue del codice quado un faro viene rilevato");
      this.setHelpUrl("");
      this.setColour("#47007d");

      this.setDeletable(false);
      this.setEditable(false);
    },
  },
});

javascriptGenerator.forBlock["on_beam_detect"] = function (block, generator) {
  const statement_actions = generator.statementToCode(block, "actions");

  const code = `async function on_beam_detect() {
${statement_actions}}\n`;
  return code;
};
