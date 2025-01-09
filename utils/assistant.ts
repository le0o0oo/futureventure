import { toast } from "vue-sonner";
import { Howl, Howler } from "howler";

const name = "Telly";

// https://pixabay.com/sound-effects/notification-alert-269289/
const sound = new Howl({
  src: ["/sounds/notification1.mp3"],
});

function say(
  text: string,
  options?: {
    duration: number;
  }
) {
  sound.play();
  toast.info(name, {
    description: text,
    duration: options?.duration,
  });
}

export default { say };
