import * as Blockly from "blockly/core";
import { javascriptGenerator, Order } from "blockly/javascript";

Blockly.common.defineBlocks({
  motor_lookat: {
    init: function () {
      this.appendValueInput("coords")
        .setCheck("Vector3")
        .appendField("Punta a coordinate");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setTooltip("Punta alle coordinate specificate");
      this.setHelpUrl("");
      this.setColour("#8f0414");
    },
  },
});

javascriptGenerator.forBlock["motor_lookat"] = function (block, generator) {
  // TODO: change Order.ATOMIC to the correct operator precedence strength
  const value_coords = generator.valueToCode(block, "coords", Order.ATOMIC);

  // TODO: Assemble javascript into the code variable.
  const code = `block_lookAt(${value_coords});\n`;
  return code;
};
