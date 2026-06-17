import { selectFolder } from "./filesystem/openFolder.js";

let openFolderBtn = document.getElementById("open-folder-button");

openFolderBtn.addEventListener("click", selectFolder);