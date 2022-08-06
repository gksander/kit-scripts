// Name: convert-heic

import "@johnlindquist/kit";

const filePath = await selectFile();

const fileName = path.basename(filePath);
const fileDir = path.resolve(filePath, "..");

await cd(fileDir);

await $`sips -s format jpeg ${fileName} --out ${fileName.replace(
  /\.heic$/i,
  ".jpg"
)}`;
