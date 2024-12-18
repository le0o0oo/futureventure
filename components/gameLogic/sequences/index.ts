import type Engine from "../Engine";

import introSequence from "./intro";

class Sequences {
  engine: Engine;

  constructor(engine: Engine) {
    this.engine = engine;
  }

  intro() {
    introSequence(this.engine);
  }
}

export default Sequences;
