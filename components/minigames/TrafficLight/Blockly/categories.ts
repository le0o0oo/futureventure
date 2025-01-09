export default {
  kind: "categoryToolbox",
  contents: [
    {
      kind: "category",
      name: "Matematica",
      categorystyle: "math_category",
      contents: [
        {
          type: "math_number",
          kind: "block",
          fields: {
            NUM: 123,
          },
        },
      ],
    },
    {
      kind: "sep",
    },
    {
      kind: "category",
      name: "Inizio",
      colour: "#00a30b",
      contents: [
        {
          type: "on_poweron",
          kind: "block",
        },
      ],
    },
    {
      kind: "category",
      name: "Luci",
      colour: "#5d02b3",
      contents: [
        {
          type: "lights_control",
          kind: "block",
        },
      ],
    },
    {
      kind: "category",
      name: "Delay",
      colour: "#80046b",
      contents: [
        {
          type: "delay",
          kind: "block",
          inputs: {
            amount: {
              shadow: {
                type: "math_number",
                fields: {
                  NUM: 10,
                },
              },
            },
          },
        },
      ],
    },
    {
      kind: "category",
      name: "Aggiornamenti",
      colour: "#046582",
      contents: [
        {
          kind: "label",
          text: "Controlla automaticamente in modo asincrono aggiornamenti",
        },
        {
          kind: "label",
          text: "del software e in caso si aggiorna in caso",
        },
        {
          type: "update",
          kind: "block",
        },
      ],
    },
    {
      kind: "sep",
    },
    {
      kind: "category",
      name: "Preset",
      colour: "#cc441f",
      contents: [
        {
          kind: "block",
          type: "on_poweron",
          inputs: {
            actions: {
              block: {
                type: "lights_control",
                fields: { action: "on", light: "red" },
                next: {
                  block: {
                    type: "delay",
                    inputs: {
                      amount: {
                        shadow: {
                          type: "math_number",
                          fields: { NUM: 10 },
                        },
                      },
                    },
                    next: {
                      block: {
                        type: "lights_control",
                        fields: { action: "off", light: "red" },
                        next: {
                          block: {
                            type: "lights_control",
                            fields: { action: "on", light: "green" },
                            next: {
                              block: {
                                type: "delay",
                                inputs: {
                                  amount: {
                                    shadow: {
                                      type: "math_number",
                                      fields: { NUM: 10 },
                                    },
                                  },
                                },
                                next: {
                                  block: {
                                    type: "lights_control",
                                    fields: { action: "off", light: "green" },
                                    next: {
                                      block: {
                                        type: "lights_control",
                                        fields: {
                                          action: "on",
                                          light: "yellow",
                                        },
                                        next: {
                                          block: {
                                            type: "delay",
                                            inputs: {
                                              amount: {
                                                shadow: {
                                                  type: "math_number",
                                                  fields: { NUM: 5 },
                                                },
                                              },
                                            },
                                            next: {
                                              block: {
                                                type: "lights_control",
                                                fields: {
                                                  action: "off",
                                                  light: "yellow",
                                                },
                                              },
                                            },
                                          },
                                        },
                                      },
                                    },
                                  },
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      ],
    },
  ],
};
