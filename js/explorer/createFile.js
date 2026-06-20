import { state } from "../state.js";
import { renderExplorer } from "./renderExplorer.js";
import { updateUI } from "../ui/updateUI.js";

async function createFile() {

const fileName =
    prompt("File name");
    updateUI()

if (!fileName) return;

const targetFolder =
    state.selectedExplorerItem?.type ===
    "directory"
        ? state.selectedExplorerItem.handle
        : state.selectedFolder;

const fileHandle =
    await createFileByName(
        fileName,
        targetFolder
    );

const newFile = {
    name: fileName,
    type: "file",
    handle: fileHandle
};

if (
    state.selectedExplorerItem?.type ===
    "directory"
) {

    state.selectedExplorerItem
        .children
        .push(newFile);

    state.selectedExplorerItem
        .isExpanded = true;

} else {

    state.folderStructure.push(
        newFile
    );

}

renderExplorer();
updateUI()
}

async function createFileByName(
fileName,
targetFolder
) {

const fileHandle =
    await targetFolder.getFileHandle(
        fileName,
        {
            create: true
        }
    );
    updateUI()

return fileHandle;

}

export {
createFile,
createFileByName
};
