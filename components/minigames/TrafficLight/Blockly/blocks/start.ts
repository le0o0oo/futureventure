import * as Blockly from "blockly/core";
import { javascriptGenerator } from "blockly/javascript";

Blockly.common.defineBlocks({
  on_poweron: {
    init: function () {
      this.appendDummyInput("").appendField("Ripeti per sempre");
      this.appendStatementInput("actions");
      this.setTooltip("Ripete per sempre il codice all'interno");
      this.setHelpUrl("");
      this.setColour("#00a30b");
    },
  },
});

javascriptGenerator.forBlock["on_poweron"] = function (block, generator) {
  const statement_actions = generator.statementToCode(block, "actions");

  const code = `LOOP {
${statement_actions}}\n`;
  return code;
};
