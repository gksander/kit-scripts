// Name: gh

import "@johnlindquist/kit";

const repos = [
  ["Spectacle", "FormidableLabs/spectacle"],
  ["Victory", "FormidableLabs/victory"],
];

const url = await arg(
  "Select repo",
  repos.map((repo) => ({
    name: repo[0],
    description: repo[1],
    value: repo[1],
  }))
);

await $`open https://github.com/${url}`;
