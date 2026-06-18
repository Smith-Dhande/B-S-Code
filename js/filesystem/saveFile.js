import { state } from "../state.js";
import { getEditor } from "../editor/monaco.js";

async function saveFile() {

    if (!state.activeFile) {
        alert("No file selected");
        return;
    }

    try {

        const editor = getEditor();

        const content = editor.getValue();

        const writable =
            await state.activeFile.handle.createWritable();

        await writable.write(content);

        await writable.close();

        console.log("File saved successfully");

    } catch (error) {

        console.error(
            "Error saving file:",
            error
        );

    }

}


export { saveFile };