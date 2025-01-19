import * as Blockly from "blockly/core";
import { javascriptGenerator, Order } from "blockly/javascript";

Blockly.common.defineBlocks({
  data_transfer_action: {
    init: function () {
      this.appendDummyInput("")
        .appendField(
          new Blockly.FieldDropdown([
            ["Disattiva", "false"],
            ["Attiva", "true"],
          ]),
          "action"
        )
        .appendField("hardware di comunicazione");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setTooltip(
        "Attiva / disattiva l'hardware di comunicazione con la Terra"
      );
      this.setHelpUrl("");
      this.setColour("#a84d07");
    },
  },
});

javascriptGenerator.forBlock["data_transfer_action"] = function (
  block,
  generator
) {
  const dropdown_action = block.getFieldValue("action");

  const code = `dataStatus.communications_enabled = ${dropdown_action};\n`;
  return code;
};
