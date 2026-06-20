import { state }
from "../state.js";

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

            editor =
                monaco.editor.create(
                    document.getElementById(
                        "editor"
                    ),
                    {
                        value: "",
                        language: "javascript",
                        theme: "vs-dark",
                        automaticLayout: true
                    }
                );

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

                    state.isModified =
                        true;

                    document.getElementById(
                        "save-status"
                    ).textContent =
                        "Modified";

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