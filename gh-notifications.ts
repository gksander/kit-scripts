// Name: gh-notifications

import "@johnlindquist/kit";

const accessToken = await env("gh-personal-access-token");
const headers = {
  Accept: "application/vnd.github+json",
  Authorization: `token ${accessToken}`,
};

const response = await get(`https://api.github.com/notifications`, {
  headers,
});

const selectedNotif = await arg(
  { placeholder: "Select a notification..." },
  (response.data as any[]).map((n) => {
    return {
      name: n.subject.title,
      description: `On ${n.repository?.name}`,
      value: n,
    };
  })
);

dev(selectedNotif);

// const d = await get(selectedNotif.url, {
//   headers,
// });

// browse(selectedNotif, { headers });
