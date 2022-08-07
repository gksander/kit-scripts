// Name: chrome tab

import "@johnlindquist/kit";

const tabs = await getTabs();

const selectedTab = await arg(
  "Which tab",
  tabs.map((tab) => {
    return {
      name: tab.title,
      description: tab.url,
      value: tab,
    };
  })
);

await focusTab(selectedTab.url);
