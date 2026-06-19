import { state } from "../state.js";
import { renderExplorer } from "../explorer/renderExplorer.js";

async function selectFolder() {


const selectedOpenFolder =
    await window.showDirectoryPicker();
    await selectedOpenFolder.requestPermission({
    mode: "readwrite"
});

state.selectedFolder = selectedOpenFolder;

state.folderStructure = await getFolderContent(selectedOpenFolder);
renderExplorer();


}

async function getFolderContent(
folderHandle
) {


const contents = [];

for await (
    const [name, handle]
    of folderHandle.entries()
) {

    if (
        handle.kind === "file"
    ) {

        contents.push({

            name,

            type: "file",

            handle,

            parentHandle:
                folderHandle

        });

    }

    else if (
        handle.kind ===
        "directory"
    ) {

        contents.push({

            name,

            type: "directory",

            handle,

            parentHandle:folderHandle,

            isExpanded: false,

            children:await getFolderContent(handle)

        });

    }

}

return contents;


}

export {selectFolder,getFolderContent};
