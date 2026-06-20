import { state }
from "../state.js";

function updateUI() {

    const savedProjectName =
        sessionStorage.getItem(
            "projectName"
        );

    const savedModel =
        sessionStorage.getItem(
            "currentModel"
        );

    const savedActiveFile =
        sessionStorage.getItem(
            "activeFile"
        );

    const savedModified =
        sessionStorage.getItem(
            "isModified"
        );

    document.getElementById(
        "project-name"
    ).textContent =

        state.selectedFolder
            ? state.selectedFolder.name
            : (
                savedProjectName
                    ? `${savedProjectName} (reopen folder)`
                    : "No folder opened"
            );

    document.getElementById(
        "active-model"
    ).textContent =

        state.currentModel
            ? state.currentModel
            : (
                savedModel ||
                "No model selected"
            );

    document.getElementById(
        "current-model-status"
    ).textContent =

        state.currentModel
            ? state.currentModel
            : (
                savedModel ||
                "AI Offline"
            );

    document.getElementById(
        "current-file-status"
    ).textContent =

        state.activeFile
            ? state.activeFile.name
            : (
                savedActiveFile
                    ? `${savedActiveFile} (closed)`
                    : "No file selected"
            );

    document.getElementById(
        "save-status"
    ).textContent =

        savedModified === "true"
            ? "Modified"
            : "Saved";

}

export {
    updateUI
};