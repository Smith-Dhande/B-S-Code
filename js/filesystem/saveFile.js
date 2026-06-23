import { state } from "../state.js";
import { renderTabs }from "../tabs/renderTabs.js";
import { getEditor } from "../editor/monaco.js";

async function saveFile() {

    if (!state.activeFile) {
        console.log("No file selected");
        return;
    }

    try {

    const editor =
        getEditor();

    const content =
        editor.getValue();

    const writable =
        await state.activeFile.handle.createWritable();

    await writable.write(
        content
    );

    await writable.close();

    state.isModified =
        false;

    state.modifiedFiles =
        state.modifiedFiles.filter(
            (fileName) =>
                fileName !==
                state.activeFile.name
        );

    sessionStorage.setItem(
        "isModified",
        "false"
    );

    document.getElementById(
        "save-status"
    ).textContent =
        "Saved";

    renderTabs();

    console.log(
        "File saved successfully"
    );

}
catch (error) {

        console.error(
            "Error saving file:",
            error
        );

    }

}


export { saveFile };