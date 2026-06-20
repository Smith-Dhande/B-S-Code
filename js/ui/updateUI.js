
import { state }
from "../state.js";

function updateUI() {
    console.log("updateUI called");
console.log("Current Model:", state.currentModel);
    document.getElementById(
        "project-name"
    ).textContent =

        state.selectedFolder
            ? state.selectedFolder.name
            : "No folder opened";

    document.getElementById(
        "active-model"
    ).textContent =

        state.currentModel
            ? state.currentModel
            : "No model selected";

    document.getElementById(
        "current-model-status"
    ).textContent =

        state.currentModel
            ? state.currentModel
            : "AI Offline";

    document.getElementById(
        "current-file-status"
    ).textContent =

        state.activeFile
            ? state.activeFile.name
            : "No file selected";

    document.getElementById(
        "save-status"
    ).textContent =

        state.isModified
            ? "Modified"
            : "Saved";

}

export {
    updateUI
};