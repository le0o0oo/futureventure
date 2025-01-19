import * as Blockly from "blockly/core";
import { javascriptGenerator, Order } from "blockly/javascript";

Blockly.common.defineBlocks({
  in_beam_sight: {
    init: function () {
      this.appendDummyInput("").appendField("È in vista del raggio?");
      this.setOutput(true, "Boolean");
      this.setTooltip(
        'Restituisce un booleano in base a se è in vista al "faro laser"'
      );
      this.setHelpUrl("");
      this.setColour("#a84d07");
    },
  },
});

javascriptGenerator.forBlock["in_beam_sight"] = function (block, generator) {
  const code = "dataStatus.beam_visible && dataStatus.communications_enabled";

  return [code, Order.NONE];
};
