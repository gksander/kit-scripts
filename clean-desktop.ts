// Name: clean desktop

import "@johnlindquist/kit";

await cd(home("Desktop"));
await $`rm *.{jpg,gif,mp4} || true`;
