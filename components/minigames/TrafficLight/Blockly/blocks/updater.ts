import * as Blockly from "blockly/core";
import { javascriptGenerator, Order } from "blockly/javascript";

Blockly.common.defineBlocks({
  update: {
    init: function () {
      this.appendDummyInput("").appendField(
        "Controlla aggiornamenti & aggiorna"
      );

      this.setTooltip(
        "Controlla per aggiornamenti del software e si aggiorna in caso"
      );
      this.setHelpUrl("");
      this.setColour("#046582");
    },
  },
});

javascriptGenerator.forBlock["update"] = function () {
  const code = `START {
  SPAWN thread2;
  th thread2 LOOP {
    res = NET https://update-server.example.com/check -h "Version: 1.0" -h "Authorization: Bearer xxxxx";
    IF res == "update" {
      new_bin = NET https://update-server.example.com -h "Version: 1.0" -h "Authorization: Bearer xxxxx";
      UPDATE new_bin;
    }
    ELSE {
      DELAY 360 sec;
    }
  }
}\n`;
  return code;
};
