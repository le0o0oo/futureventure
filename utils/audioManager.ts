import { Howl } from "howler";
import funcs from "./generalFuncs";

type musicTypes = "music1" | "music2";
let currentlyPlaying = null as musicTypes | null;
let currentId = null as number | null;

export default {
  music1: new Howl({
    src: ["/sounds/music.mpeg"],
    volume: 0.3,
    loop: true,
  }),
  music2: new Howl({
    src: ["/sounds/forest_bathing.mp3"],
    volume: 0.3,
    loop: true,
  }),

  playing: false,

  async playMusic(music: musicTypes) {
    if (!this[music]) throw new Error(`Music "${music}" not found.`);

    if (currentlyPlaying && currentId) {
      //this[currentlyPlaying as musicTypes].fade(1, 0, 1000, currentId);

      this[currentlyPlaying as musicTypes].stop();
      this.playing = false;
      currentlyPlaying = null;
      currentId = null;
      await funcs.delay(1000);
    }

    this.playing = true;
    currentId = this[music].play();
    currentlyPlaying = music;
    // (this[music] as Howl).on("end", () => {
    //   currentlyPlaying = null;
    // });
  },
};
