// Name: Kill Port
// Author: Grant Sander
// Shortcode: kp

import "@johnlindquist/kit";

const port = await arg({ placeholder: "Which Port" });

await $`kill -9 $(lsof -i:${port} -t)`;
