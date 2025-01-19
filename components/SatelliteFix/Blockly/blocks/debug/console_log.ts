import * as Blockly from "blockly/core";
import { javascriptGenerator, Order } from "blockly/javascript";

Blockly.common.defineBlocks({
  log: {
    init: function () {
      this.appendValueInput("coords").appendField("Scrivi alla console");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setTooltip("");
      this.setHelpUrl("");
      this.setColour(150);
    },
  },
});

javascriptGenerator.forBlock["log"] = function (block, generator) {
  // TODO: change Order.ATOMIC to the correct operator precedence strength
  const value_coords = generator.valueToCode(block, "coords", Order.ATOMIC);

  // TODO: Assemble javascript into the code variable.
  const code = `logToConsole(${value_coords});\n`;
  return code;
};
