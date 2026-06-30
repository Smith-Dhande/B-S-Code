import { state } from "../state.js";
import {
getFolderContent,
getExpandedFolders
} from "../filesystem/openFolder.js";
import {
renderExplorer
} from "./renderExplorer.js";
import { updateGitStatus } from "../git/gitStatus.js";

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
await updateGitStatus();

}

export { deleteItem };
