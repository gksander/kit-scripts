// Name: project

import "@johnlindquist/kit";
import { lstatSync } from "fs";
const glob = await npm("glob");

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
const actions = [];
const ACTIONS = {
  ws: "WS",
  vsc: "VSC",
  copy: "COPY",
  embedded_terminal: "EMBEDDED_TERMINAL",
  iterm: "ITERM", // TODO: Do this!
  quick_edit: "QUICK_EDIT", // TODO: Do this!
  repo: "REPO",
};

// WS
actions.push({
  name: "Open in [W]ebStorm",
  description: "Open project in WebStorm",
  value: { action: ACTIONS.ws },
});
// VSC
actions.push({
  name: "Open in [V]SCode",
  description: "Open project in VSCode",
  value: { action: ACTIONS.vsc },
});
// Copy
actions.push({
  name: "[C]opy path",
  description: "Copy the path",
  value: { action: ACTIONS.copy },
});
// Terminal
actions.push({
  name: "Embedded [t]erminal",
  description: "Open project in embedded terminal",
  value: { action: ACTIONS.embedded_terminal },
});
// Package.json
actions.push({
  name: "Open [R]epo on GitHub.com",
  description: "Open in GitHub.com",
  value: { action: ACTIONS.repo },
});
actions.push({
  name: "[Q]uick edit file",
  description: "Quick edit a file",
  value: { action: ACTIONS.quick_edit },
});

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
      const paks = await new Promise((res, rej) => {
        glob(
          "**/package.json",
          { cwd: selectedDir, ignore: "**/node_modules/**/*" },
          (err, files) => {
            if (err) rej(err);
            res(files);
          }
        );
      }).then((ps) =>
        Promise.all(ps.map((p) => readJson(path.join(selectedDir, p))))
      );

      const paksWithRepo = _.uniqBy(
        paks.map((pak) => pak?.repository?.url).filter(Boolean),
        (i) => i
      );

      if (paksWithRepo.length === 1) {
        await browse(paksWithRepo[0]);
      } else if (paksWithRepo.length > 1) {
        const selectedUrl = await arg(`Which URL?`, paksWithRepo);
        await browse(selectedUrl);
      }
    } catch {}
    break;

  // Quick-edit a file
  case ACTIONS.quick_edit:
    try {
      await cd(selectedDir);
      const files = await $`git ls-tree -r HEAD --name-only`;

      const fileToEdit = await arg(
        { placeholder: "Which file do you want to edit?" },
        files.stdout.split("\n").map((p) => {
          return {
            name: p,
            description: path.join(selectedDir, p),
            value: path.join(selectedDir, p),
          };
        })
      );

      const ext = path.extname(fileToEdit);
      console.log(ext);

      const content = await readFile(fileToEdit);

      await editor({
        value: content,
        onInput: _.debounce(async (input) => {
          await writeFile(fileToEdit, input);
        }, 1000),
      });

      // echo`Files are ${files}`;
      // await dev(files);
    } catch (err) {
      console.log("ERR!", err.message);
    }
    break;
}
