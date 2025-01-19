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
          type: "satellite_forever",
          kind: "block",
        },
        {
          type: "on_beam_detect",
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
      kind: "sep",
    },
  ],
};
