import { state }
from "../state.js";

import { renderTabs }
from "../tabs/renderTabs.js";

import { getLanguage }
from "../utils/getLanguage.js";

let editor;

function createEditor() {

    require.config({
        paths: {
            vs: "./vendor/monaco/vs"
        }
    });

    require(
        ["vs/editor/editor.main"],
        function () {

            const savedContent =
                sessionStorage.getItem(
                    "editorContent"
                ) || "";

            const activeFile =
                sessionStorage.getItem(
                    "activeFile"
                );

            const savedLanguage =
                activeFile
                    ? getLanguage(
                        activeFile
                    )
                    : "javascript";

            editor =
                monaco.editor.create(
                    document.getElementById(
                        "editor"
                    ),
                    {
                        value: savedContent,
                        language: savedLanguage,
                        theme: "vs-dark",
                        automaticLayout: true
                    }
                );

            const savedModified =
                sessionStorage.getItem(
                    "isModified"
                );

            if (
                savedModified === "true"
            ) {

                state.isModified =
                    true;

                document.getElementById(
                    "save-status"
                ).textContent =
                    "Modified";

            }

            editor.onDidChangeCursorPosition(
                (event) => {

                    document.getElementById(
                        "cursor-position"
                    ).textContent =
                        `Ln ${
                            event.position.lineNumber
                        }, Col ${
                            event.position.column
                        }`;

                }
            );

            editor.onDidChangeModelContent(
                () => {

                    if (
                        state.isOpeningFile
                    ) {
                        return;
                    }

                    const content =
                        editor.getValue();

                    if (
                        state.activeFile &&
                        !state.modifiedFiles.includes(
                            state.activeFile.name
                        )
                    ) {

                        state.modifiedFiles.push(
                            state.activeFile.name
                        );

                    }

                    state.currentFileContent =
                        content;

                    state.isModified =
                        true;

                    sessionStorage.setItem(
                        "editorContent",
                        content
                    );

                    sessionStorage.setItem(
                        "isModified",
                        "true"
                    );

                    document.getElementById(
                        "save-status"
                    ).textContent =
                        "Modified";

                    renderTabs();

                }
            );

        }
    );

}

function getEditor() {

    return editor;

}

export {
    createEditor,
    getEditor
};