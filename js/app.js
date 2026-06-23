import { selectFolder }from "./filesystem/openFolder.js";

import { initializeTheme }from "./ui/theme.js";

import { initializeSearch }from "./search/searchEvents.js";

import { initializeActivityBar}from "./ui/activityBar.js";

import { getFolderContent }from "./filesystem/openFolder.js";

import { createEditor }from "./editor/monaco.js";

import { saveFile }from "./filesystem/saveFile.js";

import { createFile }from "./explorer/createFile.js";

import { createFolder }from "./explorer/createFolder.js";

import { deleteItem }from "./explorer/deleteItem.js";

import { renderExplorer }from "./explorer/renderExplorer.js";

import { loadModels }from "./ai/models.js";

import { initializeChat }from "./ai/chat.js";

import { state }from "./state.js";

import { renderTabs } from "./tabs/renderTabs.js";

function initializeExplorerActions() {

    const newFileButton =
        document.getElementById(
            "explorer-new-file-button"
        );

    const newFolderButton =
        document.getElementById(
            "explorer-new-folder-button"
        );

    const deleteButton =
        document.getElementById(
            "delete-button"
        );

    const refreshButton =
        document.getElementById(
            "refresh-project-button"
        );

    newFileButton.addEventListener(
        "click",
        createFile
    );

    newFolderButton.addEventListener(
        "click",
        createFolder
    );

    deleteButton.addEventListener(
        "click",
        deleteItem
    );

    refreshButton.addEventListener(
        "click",
        async () => {

            if (
                !state.selectedFolder
            ) {
                return;
            }

            state.folderStructure =
                await getFolderContent(
                    state.selectedFolder
                );

            renderExplorer();

        }
    );

}

async function initializeApp() {

    createEditor();
    initializeTheme();
    renderTabs();
    initializeActivityBar();
    initializeSearch();

    
    document
    .getElementById(
        "new-file-button"
    )
    .addEventListener(
        "click",
        createFile
    );

document
    .getElementById(
        "new-folder-button"
    )
    .addEventListener(
        "click",
        createFolder
    );


    await loadModels();

    initializeChat();

    initializeExplorerActions();

    const savedModel =
        sessionStorage.getItem(
            "currentModel"
        );

    if (savedModel) {

        state.currentModel =
            savedModel;

    }

    const openFolderButton =
        document.getElementById(
            "open-folder-button"
        );

    openFolderButton.addEventListener(
        "click",
        selectFolder
    );

    const saveButton =
        document.getElementById(
            "save-button"
        );

    saveButton.addEventListener(
        "click",
        saveFile
    );

    document.addEventListener(
        "keydown",
        async (event) => {

            if (
                event.ctrlKey &&
                event.key.toLowerCase() === "s"
            ) {

                event.preventDefault();

                await saveFile();

            }

        }
    );

}

initializeApp();