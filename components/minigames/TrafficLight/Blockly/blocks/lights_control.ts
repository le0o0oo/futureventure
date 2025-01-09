import * as Blockly from "blockly/core";
import { javascriptGenerator } from "blockly/javascript";

Blockly.common.defineBlocks({
  lights_control: {
    init: function () {
      this.appendDummyInput("")
        .appendField(
          new Blockly.FieldDropdown([
            ["Accendi", "on"],
            ["Spegni", "off"],
          ]),
          "action"
        )
        .appendField("luce")
        .appendField(
          new Blockly.FieldDropdown([
            ["rossa", "red"],
            ["gialla", "yellow"],
            ["verde", "green"],
          ]),
          "light"
        );
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setTooltip("Controlla lo stato di una luce del semaforo");
      this.setHelpUrl("");
      this.setColour("#5d02b3");
    },
  },
});

javascriptGenerator.forBlock["lights_control"] = function (block, generator) {
  const dropdown_action = block.getFieldValue("action");
  const dropdown_light = block.getFieldValue("light");

  // TODO: Assemble javascript into the code variable.
  const code = `LIGHT ${dropdown_action} ${dropdown_light};\n`;
  return code;
};
