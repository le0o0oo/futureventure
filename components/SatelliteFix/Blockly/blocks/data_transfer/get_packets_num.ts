import * as Blockly from "blockly/core";
import { javascriptGenerator, Order } from "blockly/javascript";

Blockly.common.defineBlocks({
  get_total_packets: {
    init: function () {
      this.appendDummyInput("").appendField(
        "Numero totale di packets rimasti in memoria"
      );
      this.setOutput(true, "Number");
      this.setTooltip("Restituisce il numero totale di packets da trasmettere");
      this.setHelpUrl("");
      this.setColour("#a84d07");
    },
  },
});

javascriptGenerator.forBlock["get_total_packets"] = function (
  block,
  generator
) {
  const code = "dataStatus.packets_num";

  return [code, Order.NONE];
};
