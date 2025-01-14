import { Howl } from "howler";
import * as funcs from "./generalFuncs";

type musicTypes = "music1" | "music2";
let currentlyPlaying = null as musicTypes | null;
let currentId = null as number | null;

export default {
  music1: new Howl({
    src: ["/sounds/music.mpeg"],
    volume: 0.3,
  }),
  music2: new Howl({
    src: ["/sounds/forest_bathing.mp3"],
    volume: 0.3,
  }),

  async playMusic(music: musicTypes) {
    if (!this[music]) throw new Error(`Music "${music}" not found.`);

    if (currentlyPlaying && currentId) {
      this[currentlyPlaying as musicTypes].fade(1, 0, 1000, currentId);

      this[currentlyPlaying as musicTypes].stop();
      currentlyPlaying = null;
      currentId = null;
      await funcs.default.delay(1000);
    }

    currentId = this[music].play();
    currentlyPlaying = music;
    (this[music] as Howl).on("end", () => {
      currentlyPlaying = null;
    });
  },
};
