import { state }
from "../state.js";

import { getEditor }
from "./monaco.js";

import { getLanguage }
from "../utils/getLanguage.js";

import { updateUI }
from "../ui/updateUI.js";

async function openFile(
    item
) {

    const file =
        await item.handle.getFile();

    const fileContent =
        await file.text();

    const editor =
        getEditor();

    if (!editor) {

        return;

    }

    const language =
        getLanguage(
            item.name
        );

    state.activeFile =
        item;

    state.currentFileContent =
        fileContent;

    state.isModified =
        false;

    sessionStorage.setItem(
        "activeFile",
        item.name
    );

    sessionStorage.setItem(
        "editorContent",
        fileContent
    );

    sessionStorage.setItem(
        "isModified",
        "false"
    );

    const currentModel =
        editor.getModel();

    monaco.editor.setModelLanguage(
        currentModel,
        language
    );

    editor.setValue(
        fileContent
    );

    document.getElementById(
        "save-status"
    ).textContent =
        "Saved";

    updateUI();

}

export {
    openFile
};