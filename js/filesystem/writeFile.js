import { updateUI } from "../ui/updateUI.js";

async function writeFile(
fileHandle,
content
) {


const writable =
    await fileHandle.createWritable();

await writable.write(
    content
);

await writable.close();

updateUI()
}

export {
writeFile
};
