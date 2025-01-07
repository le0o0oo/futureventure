// This script simply deletes the .nuxt folder, preventing annoying issues (like NuxtImg not loading)
import { existsSync, rm } from "fs";
const deleteFolder = false; // If you want to turn off the script, set this to false

function doAction() {
  if (!deleteFolder)
    return console.log(`\x1b[36m\u2139\x1b[0m Skipping folder deletion`);
  if (!existsSync("./.nuxt"))
    return console.log(`\x1b[36m\u2139\x1b[0m No .nuxt folder found`);

  rm("./.nuxt", { recursive: true, force: true }, (err) => {
    if (err != null)
      console.log(`\x1b[31m\u2716\x1b[0m Error while deleting .nuxt`, err);
    else console.log(`\x1b[32m\u2714\x1b[0m Deleted .nuxt folder`);
  });
}
doAction();
