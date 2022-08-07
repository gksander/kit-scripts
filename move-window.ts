// name: move-window
// Menu: Move Window
// Description: Center the frontmost app

import "@johnlindquist/kit";

let { workArea, bounds } = await getActiveScreen();
let { width, height } = workArea;
let { x, y } = bounds;

let padding = 100;

// let top = y + padding;
// let left = x + padding;
// let right = x + width - padding;
// let bottom = y + height - padding;

// setActiveAppBounds({
//   top,
//   left,
//   right,
//   bottom,
// });

console.log("THING!");

await arg("Which way", async (input) => {
  return `${input}`;
});

// const size = await arg(
//   "Which way?",
//   ["left", "right"].map((dir) => ({
//     name: dir,
//     value: dir,
//     focused: dir,
//     onSubmit: async (choice) => {
//       console.log(choice);
//       dev("HEy");
//       // if (choice.value === "left") {
//       //   setActiveAppBounds({
//       //     top: y,
//       //     bottom: y + height,
//       //     left: x,
//       //     right: x + width / 2,
//       //   });
//       // } else {
//       //   setActiveAppBounds({
//       //     top: y,
//       //     bottom: y + height,
//       //     left: x + width / 2,
//       //     right: x + width,
//       //   });
//       // }
//     },
//   }))
// );
