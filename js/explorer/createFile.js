import { state } from "../state.js";
import { renderExplorer } from "./renderExplorer.js";

async function createFile() {

    const fileName = prompt("File name");

    if (!fileName) return;

    const targetFolder =
        state.selectedExplorerItem?.type === "directory"
            ? state.selectedExplorerItem.handle
            : state.selectedFolder;

    const fileHandle =
        await targetFolder.getFileHandle(
            fileName,
            {
                create: true
            }
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

}

export { createFile };