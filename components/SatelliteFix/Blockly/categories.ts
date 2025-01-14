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
          type: "on_poweron_",
          kind: "block",
        },
      ],
    },
    {
      kind: "category",
      name: "Sensori",
      colour: "#1161bd",
      contents: [
        {
          kind: "label",
          text: "Restituisce un vettore con le coordinate della Terra",
        },
        {
          type: "earth_sensor",
          kind: "block",
        },
      ],
    },
    {
      kind: "category",
      name: "Movimento",
      colour: "#8f0414",
      contents: [
        {
          kind: "label",
          text: "Prende come parametro delle coordinate e farà puntare il satellite a quelle.",
        },
        {
          type: "motor_lookat",
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
      kind: "sep",
    },
  ],
};
