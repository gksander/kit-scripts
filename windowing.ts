// name: windowing
// Description: Move active window to left half

import "@johnlindquist/kit";

let { workArea, bounds } = await getActiveScreen();
let { width, height } = workArea;
let { x, y } = bounds;

const options: {
  left: number;
  right: number;
  name: string;
  shortcut?: string;
}[] = [
  // Left
  { name: "Left Half", left: x, right: x + width / 2, shortcut: "l" },
  { name: "Left Third", left: x, right: x + width / 3 },
  { name: "Left Two-Thirds", left: x, right: x + (2 * width) / 3 },
  // Right
  { name: "Right Half", left: x + width / 2, right: x + width },
  { name: "Right Third", left: x + (2 * width) / 3, right: x + width },
  { name: "Right Two-Thirds", left: x + width / 3, right: x + width },
  // Center
  { name: "Center Half", left: x + width / 4, right: x + (3 * width) / 4 },
  { name: "Center Third", left: x + width / 3, right: x + (2 * width) / 3 },
  {
    name: "Center Two-Thirds",
    left: x + width / 6,
    right: x + (5 * width) / 6,
  },
  { name: "Full", left: x, right: x + width },
];

const { left, right } = await arg(
  {
    placeholder: "Resize to...",
    onShortcut: {
      l: () => {
        console.log("ON L");
      },
    },
  },
  options.map((op) => ({
    name: op.name,
    value: op,
    shortcut: op.shortcut,
  }))
);

setActiveAppBounds({
  top: y,
  bottom: y + height,
  left,
  right,
});
