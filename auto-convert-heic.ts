// Name: auto-convert-heic
// Watch: ~/Downloads/*.HEIC

import "@johnlindquist/kit";

// These are optional and automatically set by the watcher
const fileName = path.basename(await arg());
const event = await arg();

if (event === "add") {
  await cd(home("Downloads"));

  await $`sips -s format jpeg ${fileName} --out ${fileName.replace(
    /\.heic$/i,
    ".jpg"
  )}`;
}
