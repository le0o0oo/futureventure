import * as Blockly from "blockly/core";
import { javascriptGenerator, Order } from "blockly/javascript";

Blockly.common.defineBlocks({
  earth_sensor: {
    init: function () {
      this.appendDummyInput("").appendField("Trova posizione della Terra");
      this.setOutput(true, "Vector3");
      this.setTooltip("Restituisce un vettore con le coordinate della Terra");
      this.setHelpUrl("");
      this.setColour("#1161bd");
    },
  },
});

javascriptGenerator.forBlock["earth_sensor"] = function () {
  const code = "'EARTH_COORDS'";

  return [code, Order.NONE];
};
