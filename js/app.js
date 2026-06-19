import { selectFolder } from "./filesystem/openFolder.js";
import { createEditor } from "./editor/monaco.js";
import { saveFile } from "./filesystem/saveFile.js";
import { createFile } from "./explorer/createFile.js";
import { createFolder } from "./explorer/createFolder.js";
import { deleteItem } from "./explorer/deleteItem.js";
import { loadModels } from "./ai/models.js";
import { initializeChat } from "./ai/chat.js";


loadModels();
initializeChat();

const deleteButton =
document.getElementById(
"delete-button"
);

deleteButton.addEventListener(
"click",
deleteItem
);


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


const newFileButton = document.getElementById( "new-file-button");

newFileButton.addEventListener("click",createFile);


const newFolderButton = document.getElementById("new-folder-button");

newFolderButton.addEventListener("click", createFolder);