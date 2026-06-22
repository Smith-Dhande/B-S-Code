import { state }
from "../state.js";

import {
    applyTheme
}
from "../ui/theme.js";

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

            const savedTheme =
                sessionStorage.getItem(
                    "theme"
                );

            const systemTheme =
                window.matchMedia(
                    "(prefers-color-scheme: dark)"
                ).matches
                    ? "dark"
                    : "light";

            applyTheme(
                savedTheme ||
                systemTheme
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

                    state.currentFileContent =
                        content;

                    state.isModified =
                        true;

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