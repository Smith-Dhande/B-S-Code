import {
    getEditor
}
from "../editor/monaco.js";

import {
    executeCommand
}
from "./commands.js";

function initializeTerminal() {

    const terminalButton =
        document.getElementById(
            "terminal-view-btn"
        );

    const terminal =
        document.getElementById(
            "terminal-container"
        );

    const closeButton =
        document.getElementById(
            "close-terminal-button"
        );

    const input =
        document.getElementById(
            "terminal-input"
        );

    console.log(
        "Terminal initialized"
    );

    terminalButton.addEventListener(
        "click",
        () => {

            terminal.hidden =
                false;

            input.focus();

            const editor =
                getEditor();

            if (
                editor
            ) {

                setTimeout(
                    () => {

                        editor.layout();

                    },
                    0
                );

            }

        }
    );

    closeButton.addEventListener(
        "click",
        () => {

            terminal.hidden =
                true;

            const editor =
                getEditor();

            if (
                editor
            ) {

                setTimeout(
                    () => {

                        editor.layout();

                    },
                    0
                );

            }

        }
    );

    input.addEventListener(
        "keydown",
        (
            event
        ) => {

            if (
                event.key !==
                "Enter"
            ) {

                return;

            }

            const command =
                input.value.trim();

            if (
                !command
            ) {

                return;

            }

            console.log(
                "Command:",
                command
            );

            executeCommand(
                command
            );

            input.value =
                "";

        }
    );

}

export {
    initializeTerminal
};