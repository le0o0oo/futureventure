import * as Blockly from "blockly/core";
import { javascriptGenerator, Order } from "blockly/javascript";

Blockly.common.defineBlocks({
  delay: {
    init: function () {
      this.appendValueInput("amount").setCheck("Number").appendField("Attendi");
      this.appendDummyInput("").appendField("secondi");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setTooltip(
        "Pausa l'esecuzione del programma per un certo periodo di tempo"
      );
      this.setHelpUrl("");
      this.setColour("#80046b");
    },
  },
});

javascriptGenerator.forBlock["delay"] = function (block, generator) {
  const value_amount = generator.valueToCode(block, "amount", Order.ATOMIC);

  const code = `DELAY ${
    value_amount != "" && Number(value_amount) < 120 ? value_amount : "0"
  } sec;\n`;
  return code;
};
