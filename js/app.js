import { selectFolder } from "./filesystem/openFolder.js";
import { createEditor } from "./editor/monaco.js";

createEditor();

let openFolderBtn = document.getElementById("open-folder-button");

openFolderBtn.addEventListener("click", selectFolder);