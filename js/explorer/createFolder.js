import { state } from "../state.js";
import { renderExplorer } from "./renderExplorer.js";

async function createFolder() {

    const folderName =
        prompt("Folder name");

    if (!folderName) return;

    const targetFolder =
        state.selectedExplorerItem?.type ===
        "directory"
            ? state.selectedExplorerItem.handle
            : state.selectedFolder;

    const folderHandle =
        await createFolderByName(
            folderName,
            targetFolder
        );

    const newFolder = {
        name: folderName,
        type: "directory",
        handle: folderHandle,
        isExpanded: false,
        children: []
    };

    if (
        state.selectedExplorerItem?.type ===
        "directory"
    ) {

        state.selectedExplorerItem
            .children
            .push(newFolder);

        state.selectedExplorerItem
            .isExpanded = true;

    } else {

        state.folderStructure.push(
            newFolder
        );

    }

    renderExplorer();

}

async function createFolderByName(
    folderName,
    targetFolder
) {

    return await targetFolder
        .getDirectoryHandle(
            folderName,
            {
                create: true
            }
        );

}

export {
    createFolder,
    createFolderByName
};