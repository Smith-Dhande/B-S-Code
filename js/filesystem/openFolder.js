import { state } from "../state.js";

import { renderExplorer } from "../explorer/renderExplorer.js";

import { updateUI } from "../ui/updateUI.js";

import { saveFolderHandle }from "./folderHandleStorage.js";

import { updateGitStatus } from "../git/gitStatus.js";

async function selectFolder() {
    let selectedOpenFolder;
    try {
        selectedOpenFolder = await window.showDirectoryPicker();
        await selectedOpenFolder.requestPermission({
            mode: "readwrite"
        });
    } catch (pickerError) {
        console.log("Directory picker canceled or permission denied:", pickerError);
        return;
    }

    try {
        const project =
            await window.filesystem.openFolder();

        if (
            !project
        ) {
            return;
        }

        state.projectPath =
            project.path;

        localStorage.setItem("projectPath", state.projectPath);

        await window.terminal.changeDirectory(
            state.projectPath
        );

        console.log(
            "Project Path :",
            state.projectPath
        );

        await updateGitStatus();

        state.selectedFolder =
            selectedOpenFolder;

        await saveFolderHandle(
            selectedOpenFolder
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

        sessionStorage.setItem(
            "projectName",
            selectedOpenFolder.name
        );

        updateUI();

        renderExplorer();
    } catch (error) {
        console.error("Open Folder Error in selectFolder:", error);
        console.error(error.stack);
        throw error;
    }
}

function getExpandedFolders(
    items,
    expanded = []
) {

    items.forEach(
        (
            item
        ) => {

            if (
                item.type ===
                "directory"
            ) {

                if (
                    item.isExpanded
                ) {

                    expanded.push(
                        item.path
                    );

                }

                getExpandedFolders(
                    item.children,
                    expanded
                );

            }

        }
    );

    return expanded;

}

async function getFolderContent(
    folderHandle,
    currentPath = "",
    expandedFolders = []
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
                expandedFolders.includes(
                    fullPath
                ),

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
    restoreProjectState,
    getExpandedFolders
};