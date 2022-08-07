// Name: launch
// Author: Grant Sander
// Shortcut: opt o

import "@johnlindquist/kit";

const appDb = await db("app-launch-cache");

const appLocations = [
  "/Applications",
  home("Applications", "JetBrains Toolbox"),
  "/System",
];

// Search for apps if cache is stale
let apps = appDb?.apps || [];
if (!appDb.lastIndexed || Date.now() - appDb.lastIndexed > 10 * 60 * 1000) {
  const foundApps = await Promise.all(
    appLocations.map((loc) =>
      fileSearch("", { onlyin: loc, kind: "application" })
    )
  )
    .then((locs) => _.uniq(locs.flat()))
    .then((list) =>
      list.map((name) => ({ name: name.split("/").pop().replace(".app", "") }))
    );

  // Merge by app name
  apps = _(apps)
    .keyBy("name")
    .merge(_.keyBy(foundApps, "name"))
    .values()
    .value();

  appDb.lastIndexed = Date.now();
  appDb.apps = apps;
  appDb.write();
}

const selectedApp = await arg(
  { placeholder: "Which app?" },
  apps
    .sort((a, b) => +a.lastUsed - +b.lastUsed)
    .map(({ name }) => {
      return {
        name,
        description: name,
        value: name,
      };
    })
);

const dbVal = appDb.data.apps.find((a) => a.name === selectedApp);
dbVal.lastUsed = Date.now();
await appDb.write();

await $`open -a ${selectedApp}`;
