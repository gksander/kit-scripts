// Name: resize image
// Author: Grant Sander

let sharp = await npm("sharp");

let imagePath = await getSelectedFile();
if (!imagePath) imagePath = await selectFile(`Choose an image:`);

let extension = path.extname(imagePath);
let allowImageExtensions = [".png", ".jpg"];
while (!allowImageExtensions.includes(extension)) {
  let fileName = path.basename(imagePath);

  imagePath = await selectFile(`${fileName} wasn't an image:`);
  if (!imagePath) exit();

  extension = path.extname(imagePath);
}

let width = Number(
  await arg({
    placeholder: "Enter width",
    hint: imagePath,
    panel: `<img src="${imagePath}" class="w-full"/>`,
  })
);

const resizedImageName = imagePath.replace(
  new RegExp(`${extension}$`),
  `-${width}${extension}`
);

await sharp(imagePath).resize({ width }).toFile(resizedImageName);
