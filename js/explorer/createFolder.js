import { state } from "../state.js";

import { renderExplorer }
from "./renderExplorer.js";

async function createFolder() {

    if (
        !state.selectedFolder
    ) {

        console.log(
            "Open a folder first"
        );

        return;

    }

    state.isCreatingFile =
        false;

    state.isCreatingFolder =
        true;

    renderExplorer();

}

async function createFolderByName(
    folderName,
    targetFolder
) {

    const folderHandle =
        await targetFolder.getDirectoryHandle(
            folderName,
            {
                create: true
            }
        );

    return folderHandle;

}

export {
    createFolder,
    createFolderByName
};