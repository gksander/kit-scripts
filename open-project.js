// Name: open-project

import "@johnlindquist/kit";

const roots = ["GitHub", "Playground", "DeleteMe"];

const allDirs = await Promise.all(
  roots.map(async (root) => ({
    dirs: await readdir(home(root)),
    root,
  }))
).then((groups) => {
  const allDirs = [];
  groups.forEach(({ dirs, root }) => {
    allDirs.push(...dirs.map((name) => ({ name, root })));
  });

  return allDirs;
});

const selectedDir = await arg(
  "Select project:",
  allDirs.map(({ name, root }) => ({
    name,
    description: path.join(root, name),
    value: path.join(root, name),
  }))
);

edit(selectedDir);
