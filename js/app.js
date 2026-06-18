import { selectFolder } from "./filesystem/openFolder.js";
import { createEditor } from "./editor/monaco.js";
import { saveFile } from "./filesystem/saveFile.js";


const saveButton =
    document.getElementById("save-button");

saveButton.addEventListener(
    "click",
    saveFile
);

createEditor();

let openFolderBtn = document.getElementById("open-folder-button");

openFolderBtn.addEventListener("click", selectFolder);

document.addEventListener("keydown", async (event) => {

    if (event.ctrlKey && event.key.toLowerCase() === "s") {

        event.preventDefault();

        await saveFile();

    }

});