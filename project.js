// Name: project
// Author: Grant Sander
// Shortcut: opt p
// Shortcode: p

import "@johnlindquist/kit";
import { lstatSync } from "fs";

const toCrawl = ["GitHub", "Playground", "DeleteMe", [".kenv", ["scripts"]]];

// Collect direct dirs from toCrawl
const allDirs = await Promise.all(
  toCrawl.map(async (r) => {
    const root = home(Array.isArray(r) ? r[0] : r);

    return {
      dirs: (await readdir(root))
        .filter((dir) => (Array.isArray(r) ? r[1].includes(dir) : true))
        .filter((dir) => lstatSync(path.join(root, dir)).isDirectory()),
      root,
    };
  })
).then((groups) => {
  const allDirs = [];
  groups.forEach(({ dirs, root }) => {
    allDirs.push(...dirs.map((name) => ({ name, root })));
  });

  return allDirs;
});

// Select a directory
const selectedDir = await arg(
  { placeholder: "Select project:" },
  allDirs.map(({ name, root }) => ({
    name,
    description: path.join(root, name),
    value: path.join(root, name),
    preview: md(`# ${name}\n## ${root}`),
  }))
);

// What can we do?
const ACTIONS = {
  ws: "WS",
  vsc: "VSC",
  copy: "COPY",
  embedded_terminal: "EMBEDDED_TERMINAL",
  iterm: "ITERM",
  repo: "REPO",
  ghd: "GITHUB_DESKTOP",
  finder: "FINDER",
};

const actions = [
  {
    name: "Open in [W]ebStorm",
    description: "Open project in WebStorm",
    value: { action: ACTIONS.ws },
  },
  {
    name: "Open in [V]SCode",
    description: "Open project in VSCode",
    value: { action: ACTIONS.vsc },
  },
  {
    name: "[C]opy path",
    description: "Copy the path",
    value: { action: ACTIONS.copy },
  },
  {
    name: "Embedded [t]erminal",
    description: "Open project in embedded terminal",
    value: { action: ACTIONS.embedded_terminal },
  },
  {
    name: "Open with [i]Term",
    description: "Open with iTerm",
    value: { action: ACTIONS.iterm },
  },
  {
    name: "Open [R]epo on GitHub.com",
    description: "Open in GitHub.com",
    value: { action: ACTIONS.repo },
  },
  {
    name: "Open in [G]itHub Desktop",
    description: "Open in GitHub Desktop",
    value: { action: ACTIONS.ghd },
  },
  {
    name: "Reveal in [F]inder",
    description: "Reveal project in Finder",
    value: { action: ACTIONS.finder },
  },
];

const todo = await arg({ placeholder: "What do you want to do?" }, actions);

switch (todo.action) {
  // Webstorm: ezpz
  case ACTIONS.ws:
    await edit(selectedDir);
    break;
  // VSC: ezpz
  case ACTIONS.vsc:
    await $`code ${selectedDir}`;
    break;
  // Copy to clipboard: ezpz
  case ACTIONS.copy:
    copy(selectedDir);
    break;
  // Embedded terminal: ezpz
  case ACTIONS.embedded_terminal:
    await term({
      cwd: selectedDir,
      footer: `cmd+enter to continue`,
    });
    break;
  // Open repo on GitHub.com
  case ACTIONS.repo:
    try {
      await cd(selectedDir);
      const url = (await $`git config --get remote.origin.url`).stdout;
      const newUrl = url
        .replace(/\n/g, "")
        .replace(
          /^git@(?<base>.*):(?<org>.*)\/(?<repo>.*)\.git$/,
          "https://$1/$2/$3"
        );

      await browse(newUrl);
    } catch (err) {
      dev(err.message);
    }
    break;
  case ACTIONS.iterm:
    await $`open -a iTerm ${selectedDir}`;
    break;
  case ACTIONS.ghd:
    await $`github ${selectedDir}`;
    break;
  case ACTIONS.finder:
    await revealInFinder(selectedDir);
    break;
}
