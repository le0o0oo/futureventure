import type Engine from "../Engine";

import introSequence from "./intro";
import firstTask from "./intro/firstTask";

import traffic_light from "./traffic_light";
import second_task from "./second_task";

import basic_done from "./basic_done";
import to_drone from "./to_drone";

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

  async second_task() {
    await second_task(this.engine);
  }

  async basic_done() {
    await basic_done(this.engine);
  }

  async to_drone() {
    await to_drone(this.engine);
  }
}

export default Sequences;
