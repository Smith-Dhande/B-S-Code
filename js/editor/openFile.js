    import { state }
    from "../state.js";

    import { getEditor }
    from "./monaco.js";

    import { getLanguage }
    from "../utils/getLanguage.js";

    import { updateUI }
    from "../ui/updateUI.js";

    import { renderTabs }
    from "../tabs/renderTabs.js";

    async function openFile(
        item
    ) {

        const file =
            await item.handle.getFile();

        const fileContent =
            await file.text();

        const editor =
            getEditor();

        if (
            !editor
        ) {
            return;
        }

        const language =
            getLanguage(
                item.name
            );

        state.activeFile =
            item;

        const existingTab =
            state.openTabs.find(
                (tab) =>
                    tab.name ===
                    item.name
            );

        if (
            !existingTab
        ) {

            state.openTabs.push(
                item
            );

        }

        state.currentFileContent =
            fileContent;

        state.isModified =
            false;

        state.modifiedFiles =
            state.modifiedFiles.filter(
                (fileName) =>
                    fileName !==
                    item.name
            );

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

        state.isOpeningFile =
            true;

        editor.setValue(
            fileContent
        );

        setTimeout(
            () => {

                state.isOpeningFile =
                    false;

            },
            0
        );

        document.getElementById(
            "save-status"
        ).textContent =
            "Saved";

        renderTabs();

        updateUI();

    }

    export {
        openFile
    };