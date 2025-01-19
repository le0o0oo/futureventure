import * as Blockly from "blockly/core";
import { javascriptGenerator, Order } from "blockly/javascript";

Blockly.common.defineBlocks({
  invert_coords: {
    init: function () {
      this.appendValueInput("coords")
        .setCheck("Vector3")
        .appendField("Inverti coordinate");
      this.setOutput(true, "Vector3");
      this.setTooltip(
        "Inverte l'asse orizzontale e laterale date delle coordinate"
      );
      this.setHelpUrl("");
      this.setColour("#1161bd");
    },
  },
});

javascriptGenerator.forBlock["invert_coords"] = function (block, generator) {
  const value_coords = generator.valueToCode(block, "coords", Order.ATOMIC);

  const code = `invertCoords(${value_coords})`;

  return [code, Order.NONE];
};
