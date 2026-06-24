import { state } from "../state.js";
import {
getFolderContent
} from "../filesystem/openFolder.js";
import {
renderExplorer
} from "./renderExplorer.js";

async function deleteItem() {

if (
    !state.selectedExplorerItem
) {

    console.log(
        "Select a file or folder"
    );

    return;

}

const item =
    state.selectedExplorerItem;

const confirmDelete =
    confirm(
        `Delete ${item.name}?`
    );

if (!confirmDelete)
    return;

await item.parentHandle
    .removeEntry(
        item.name,
        {
            recursive: true
        }
    );

const expandedFolders =
    getExpandedFolders(
        state.folderStructure
    );

state.folderStructure =
    await getFolderContent(
        state.selectedFolder,
        "",
        expandedFolders
    );

state.selectedExplorerItem =
    null;

renderExplorer();

}

export { deleteItem };
