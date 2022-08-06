// Name: project

import "@johnlindquist/kit";
import { lstatSync } from "fs";

const flags = {
  ws: {
    name: "Webstorm",
    shortcut: "cmd+o",
  },
  copy: {
    name: "Copy",
    shortcut: "cmd+c",
  },
  terminal: {
    name: "Terminal",
    shortcut: "cmd+t",
  },
  vsc: {
    name: "VSCode",
    shortcut: "cmd+l",
  },
};

const toCrawl = ["GitHub", "Playground", "DeleteMe", [".kenv", ["scripts"]]];

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

const selectedDir = await arg(
  { placeholder: "Select project:", flags },
  allDirs.map(({ name, root }) => ({
    name,
    description: path.join(root, name),
    value: path.join(root, name),
    preview: md(`# ${name}\n## ${root}`),
  }))
);

// Copy to clipboard
if (flag?.copy) {
  copy(selectedDir);
}
// Open in integrated terminal
else if (flag?.terminal) {
  await term({
    cwd: selectedDir,
    footer: `cmd+enter to continue`,
  });
}
// VSCode
else if (flag?.vsc) {
  await $`code ${selectedDir}`;
}
// Default editor (WS)
else {
  edit(selectedDir);
}
