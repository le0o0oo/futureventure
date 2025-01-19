import * as Blockly from "blockly/core";
import { javascriptGenerator, Order } from "blockly/javascript";

Blockly.common.defineBlocks({
  sun_sensor: {
    init: function () {
      this.appendDummyInput("").appendField("Trova posizione del Sole");
      this.setOutput(true, "Vector3");
      this.setTooltip("Restituisce un vettore con le coordinate del Sole");
      this.setHelpUrl("");
      this.setColour("#1161bd");
    },
  },
});

javascriptGenerator.forBlock["sun_sensor"] = function () {
  const code = "getSunCoords()";

  return [code, Order.NONE];
};
