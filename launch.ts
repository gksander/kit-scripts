// Name: launch
// Author: Grant Sander
// Shortcut: opt o
// Shortcode: l

import "@johnlindquist/kit";

const appLocations = [
  "/Applications",
  home("Applications", "JetBrains Toolbox"),
];

const trimName = (name: string) => name.split("/").pop().replace(".app", "");

const apps = await Promise.all(appLocations.map((loc) => readdir(loc)))
  .then((locs) => locs.flat())
  .then((list) => list.map(trimName))
  .then((list) => _.uniq(list));

const addedSystemApps = ["Finder", "Preview"];

const selectedApp = await arg(
  { placeholder: "Which app?" },
  apps
    .concat(addedSystemApps)
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

if (selectedApp === "s") {
  const sysApps = await fileSearch("", {
    onlyin: "/System",
    kind: "application",
  }).then((list) => list.map(trimName));

  const sysApp = await arg(
    { placeholder: "Which system app?" },
    sysApps.map((name) => ({
      name,
      description: name,
      value: name,
    }))
  );

  await $`open -a ${sysApp}`;
} else {
  await $`open -a ${selectedApp}`;
}
