// Name: site
// Author: Grant Sander

import "@johnlindquist/kit";

const sites = [["Facebook", "https://facebook.com"]];

const url = await arg(
  "Select site:",
  sites.map(([name, url]) => ({
    name,
    description: url,
    value: url,
  }))
);

browse(url);
