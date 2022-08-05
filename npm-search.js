// Name: npm-search
// Decription: Search for npm package

import "@johnlindquist/kit";

let url = await arg(
  { debounceInput: 300, placeholder: "Search..." },
  async (query) => {
    const packages = (
      (await get(`https://registry.npmjs.org/-/v1/search?text=${query}`))?.data
        ?.objects || []
    ).map((o) => o.package);

    return packages.map((pkg) => {
      return {
        name: pkg.name,
        description: pkg.description,
        value: pkg.links.npm,
      };
    });
  }
);

await $`open ${url}`;
