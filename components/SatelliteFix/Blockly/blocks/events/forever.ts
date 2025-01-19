import * as Blockly from "blockly/core";
import { javascriptGenerator } from "blockly/javascript";

Blockly.common.defineBlocks({
  satellite_forever: {
    init: function () {
      this.appendDummyInput("").appendField("Ripeti per sempre");
      this.appendStatementInput("actions");
      this.setTooltip("Ripete per sempre il codice all'interno");
      this.setHelpUrl("");
      this.setColour("#00a30b");

      this.setDeletable(false);
      this.setEditable(false);
    },
  },
});

javascriptGenerator.forBlock["satellite_forever"] = function (
  block,
  generator
) {
  const statement_actions = generator.statementToCode(block, "actions");

  const code = `function loop() {
${statement_actions}}\n`;
  return code;
};
