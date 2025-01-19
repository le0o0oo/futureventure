import * as Blockly from "blockly/core";
import { javascriptGenerator, Order } from "blockly/javascript";

Blockly.common.defineBlocks({
  is_beam_connected: {
    init: function () {
      this.appendDummyInput("").appendField("È connesso con il faro?");
      this.setOutput(true, "Boolean");
      this.setTooltip(
        "Restituisce un booleano in base a se è connesso alla Terra via laser"
      );
      this.setHelpUrl("");
      this.setColour("#a84d07");
    },
  },
});

javascriptGenerator.forBlock["is_beam_connected"] = function (
  block,
  generator
) {
  const code = "dataStatus.beam_connected && dataStatus.communications_enabled";

  return [code, Order.NONE];
};
