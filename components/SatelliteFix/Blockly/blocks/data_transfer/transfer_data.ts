import * as Blockly from "blockly/core";
import { javascriptGenerator, Order } from "blockly/javascript";

Blockly.common.defineBlocks({
  packet_transfer: {
    init: function () {
      this.appendDummyInput("").appendField("Trasferisci 1 packet alla Terra");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setTooltip("Trasferisce un packet alla Terra via laser");
      this.setHelpUrl("");
      this.setColour("#a84d07");
    },
  },
});

javascriptGenerator.forBlock["packet_transfer"] = function () {
  const code = "transfer_packet();\n";
  return code;
};
