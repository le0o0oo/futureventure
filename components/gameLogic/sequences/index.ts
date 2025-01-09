import type Engine from "../Engine";

import introSequence from "./intro";
import firstTask from "./intro/firstTask";

import traffic_light from "./traffic_light";

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
  async traffic_light() {
    traffic_light(this.engine);
  }
}

export default Sequences;
