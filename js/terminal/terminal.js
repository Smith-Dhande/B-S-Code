import {
    getEditor
}
from "../editor/monaco.js";

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

    const output =
        document.getElementById(
            "terminal-output"
        );

    terminalButton.addEventListener(
        "click",
        () => {

            terminal.hidden = false;

            input.focus();

            const editor =
                getEditor();

            if (editor) {

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

            terminal.hidden = true;

            const editor =
                getEditor();

            if (editor) {

                setTimeout(
                    () => {

                        editor.layout();

                    },
                    0
                );

            }

        }
    );

    window.terminal.onOutput(

        (data) => {

            output.textContent += data;

            output.scrollTop =
                output.scrollHeight;

        }

    );

    input.addEventListener(

        "keydown",

        async (

            event

        ) => {

            if (

                event.key !== "Enter"

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

            output.textContent +=
                `> ${command}\n`;

            await window.terminal.execute(

                command

            );

            input.value = "";

        }

    );

}

export {

    initializeTerminal

};