import { toast } from "vue-sonner";

const name = "Telly";

function say(
  text: string,
  options?: {
    duration: number;
  }
) {
  toast.info(name, {
    description: text,
    duration: options?.duration,
  });
}

export default { say };
