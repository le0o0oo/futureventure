import * as Blockly from "blockly/core";
import { javascriptGenerator, Order } from "blockly/javascript";

Blockly.common.defineBlocks({
  sensors_action: {
    init: function () {
      this.appendDummyInput("")
        .appendField(
          new Blockly.FieldDropdown([
            ["Disattiva", "false"],
            ["Attiva", "true"],
          ]),
          "action"
        )
        .appendField("tutti i sensori");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setTooltip("Trasferisce un packet alla Terra via laser");
      this.setHelpUrl("");
      this.setColour("#1161bd");
    },
  },
});

javascriptGenerator.forBlock["sensors_action"] = function (block, generator) {
  const dropdown_action = block.getFieldValue("action");

  const code = `dataStatus.sensors_enabled = ${dropdown_action};\n`;
  return code;
};
