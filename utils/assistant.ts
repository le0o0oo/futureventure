import { toast } from "vue-sonner";
import { Howl, Howler } from "howler";

import ToastSkeleton from "~/components/ToastSkeleton.vue";

const name = "Telly";

// https://pixabay.com/sound-effects/notification-alert-269289/
const sound = new Howl({
  src: ["/sounds/notification1.mp3"],
});

function say(
  text: string,
  options?: {
    duration?: number;
    icon?: "normal" | "greet" | "happy" | "none";
  }
) {
  sound.play();

  if (!options) options = {};
  if (!options.icon) options.icon = "none";

  toast.custom(
    markRaw(
      h(ToastSkeleton, {
        description: text, // Pass the description as a prop
        assistantState: options.icon, // Pass the icon state as a prop
      })
    ),
    {
      duration: options?.duration,
    }
  );
  // toast.info(name, {
  //   description: text,
  //   duration: options?.duration,
  // });
}

export default { say };
