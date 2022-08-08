// name: left 1/2
// Description: Move active window to left half

import "@johnlindquist/kit";

let { workArea, bounds } = await getActiveScreen();
let { width, height } = workArea;
let { x, y } = bounds;

setActiveAppBounds({
  top: y,
  bottom: y + height,
  left: x,
  right: x + width / 2,
});
