import { selectFolder } from "./filesystem/openFolder";


let openFolderBtn = document.getElementById("open-folder-button");
openFolderBtn.addEventListener("click", selectFolder());