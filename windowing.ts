// name: windowing
// Description: Move active window to left half
// Shortcode: w

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

const previewWidth = 300;
const previewHeight = (height / width) * previewWidth;

const { left, right } = await arg(
  {
    placeholder: "Resize to...",
  },
  options.map((op) => ({
    name: op.name,
    value: op,
    shortcut: op.shortcut,
    preview:
      async () => `<div class="p-3 flex items-center justify-center h-full">
      <svg viewbox="${x} ${y} ${width} ${height}" width="${previewWidth}" height="${previewHeight}" class="rounded shadow-lg overflow-hidden border-2">
        <rect x="${op.left}" y="${y}" width="${
        op.right - op.left
      }" height="${height}" fill="purple" />
      </svg>
    </div>`,
  }))
);

setActiveAppBounds({
  top: y,
  bottom: y + height,
  left,
  right,
});
