// name: full screen
// Menu: Full Screen
// Description: Resize active window to full screen

import "@johnlindquist/kit";

let { workArea, bounds } = await getActiveScreen();
let { width, height } = workArea;
let { x, y } = bounds;

setActiveAppBounds({
  top: y,
  bottom: y + height,
  left: x,
  right: x + width,
});
