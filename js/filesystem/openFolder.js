import { state } from "../state.js";

import { renderExplorer }
from "../explorer/renderExplorer.js";

import { updateUI }
from "../ui/updateUI.js";

async function selectFolder() {

    const selectedOpenFolder =
        await window.showDirectoryPicker();

    await selectedOpenFolder.requestPermission({
        mode: "readwrite"
    });

    state.selectedFolder =
        selectedOpenFolder;

    state.folderStructure =
        await getFolderContent(
            selectedOpenFolder
        );

    sessionStorage.setItem(
        "projectName",
        selectedOpenFolder.name
    );

    updateUI();

    renderExplorer();
    console.log(state.folderStructure);

}

async function getFolderContent(
    folderHandle,
    currentPath = ""
) {

    const contents = [];

    for await (
        const [name, handle]
        of folderHandle.entries()
    ) {

        const fullPath =
            currentPath
                ? `${currentPath}/${name}`
                : name;

        if (
            handle.kind === "file"
        ) {

            contents.push({

                name,

                path:
                    fullPath,

                type:
                    "file",

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

                path:
                    fullPath,

                type:
                    "directory",

                handle,

                parentHandle:
                    folderHandle,

                isExpanded:
                    false,

                children:
                    await getFolderContent(
                        handle,
                        fullPath
                    )

            });

        }

    }

    return contents;

}

function restoreProjectState() {

    const projectName =
        sessionStorage.getItem(
            "projectName"
        );

    if (
        !projectName
    ) {

        return;

    }

    state.selectedFolder =
        null;

    state.folderStructure =
        [];

    updateUI();

    renderExplorer();

}

export {
    selectFolder,
    getFolderContent,
    restoreProjectState
};