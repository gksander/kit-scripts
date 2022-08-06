// Name: open-app
// Author: Grant Sander
// Shortcut: opt o

import "@johnlindquist/kit";

const appLocations = [
  "/Applications",
  home("Applications", "JetBrains Toolbox"),
];

const apps = await Promise.all(appLocations.map((loc) => readdir(loc))).then(
  (locs) => locs.flat()
);

const selectedApp = await arg(
  { placeholder: "Which app?" },
  apps.map((appName) => {
    return {
      name: appName.replace(/\.app$/, ""),
      description: appName,
      value: appName,
    };
  })
);

await $`open -a ${selectedApp}`;
