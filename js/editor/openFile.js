import { state } from "../state.js";
import { getEditor } from "./monaco.js";
import { getLanguage } from "../utils/getLanguage.js";
import { updateUI } from "../ui/updateUI.js";

async function openFile(item) {

    const file = await item.handle.getFile();

    const fileContent = await file.text();

    state.activeFile = item;
    updateUI();
    state.currentFileContent = fileContent;

    const editor = getEditor();

    if (!editor) {
        return;
    }

    const language = getLanguage(item.name);

    const currentModel = editor.getModel();

    monaco.editor.setModelLanguage(
        currentModel,
        language
    );

    editor.setValue(fileContent);
    updateUI()

}

export { openFile };