// Name: launch
// Author: Grant Sander
// Shortcut: opt o
// Shortcode: l

import "@johnlindquist/kit";

const appLocations = [
  "/Applications",
  home("Applications", "JetBrains Toolbox"),
  // "/System",
];

const apps = await Promise.all(
  appLocations.map((loc) =>
    fileSearch("", { onlyin: loc, kind: "application" })
  )
)
  .then((locs) => _.uniq(locs.flat()))
  .then((list) =>
    list.map((name) => name.split("/").pop().replace(".app", ""))
  );

// Merge by app name

const selectedApp = await arg(
  { placeholder: "Which app?" },
  apps
    .map((name) => {
      return {
        name,
        description: name,
        value: name,
        shortcode: [],
      };
    })
    .concat({
      name: "System",
      description: "Search system apps",
      value: "s",
      shortcode: ["s"],
    })
);

// const dbVal = appDb.data.apps.find((a) => a.name === selectedApp);
// dbVal.lastUsed = Date.now();
// await appDb.write();

if (selectedApp === "s") {
  await dev("hey");
} else {
  await $`open -a ${selectedApp}`;
}
