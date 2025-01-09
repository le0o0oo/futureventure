import type Engine from "../Engine";

import introSequence from "./intro";
import firstTask from "./intro/firstTask";

class Sequences {
  engine: Engine;

  constructor(engine: Engine) {
    this.engine = engine;
  }

  async all() {
    await this.intro();
    await this.firstTask();
  }

  async intro() {
    await introSequence(this.engine);
  }
  async firstTask() {
    await firstTask(this.engine);
  }
}

export default Sequences;
