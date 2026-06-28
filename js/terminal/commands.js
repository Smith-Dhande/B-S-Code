import { state }from "../state.js";

function executeCommand(command)
{
    appendLine(`> ${command}`);
    const parts = command.split(" ");
    const cmd = parts[0].toLowerCase();
    switch ( cmd ) {
        case "help":
    appendLine("Available Commands:");
    appendLine("");
    appendLine("• help");
    appendLine("• clear");
    appendLine("• pwd");
    appendLine("• ls");

    appendLine(
        "• tree"
    );

    appendLine(
        "• echo"
    );

    appendLine(
        "• date"
    );

    appendLine(
        "• whoami"
    );

    appendLine(
        "• project"
    );

    appendLine(
        "• count"
    );

    appendLine(
        "• history"
    );

    break;

            break;

        case "clear":

            document
                .getElementById(
                    "terminal-output"
                )
                .innerHTML = "";

            return;

        case "pwd":

            appendLine(
                sessionStorage.getItem(
                    "projectName"
                ) ||
                "No Project Open"
            );

            break;

        case "ls":

            state.folderStructure.forEach(
                (
                    item
                ) => {

                    appendLine(
                        item.name
                    );

                }
            );

            break;

        case "tree":

            renderTree(
                state.folderStructure,
                ""
            );

            break;

        case "echo":

            appendLine(
                parts
                    .slice(1)
                    .join(" ")
            );

            break;

        case "date":

            appendLine(
                new Date()
                .toString()
            );

            break;

        case "whoami":

            appendLine(
                "BS Code User"
            );

            break;

        case "project":

            appendLine(
                sessionStorage.getItem(
                    "projectName"
                ) ||
                "No Project Open"
            );

            break;

        case "count":

            appendLine(
                `Total Files: ${
                    countFiles(
                        state.folderStructure
                    )
                }`
            );

            break;

        case "history":

            renderHistory();

            break;

        default:

            appendLine(
                `Unknown command: ${cmd}`
            );

    }

    saveHistory(
        command
    );

}

function countFiles(
    items
) {

    let total = 0;

    items.forEach(
        (
            item
        ) => {

            if (
                item.type ===
                "file"
            ) {

                total++;

            }

            if (
                item.type ===
                "directory"
            ) {

                total +=
                    countFiles(
                        item.children
                    );

            }

        }
    );

    return total;

}

function renderTree(
    items,
    prefix
) {

    items.forEach(
        (
            item
        ) => {

            appendLine(
                `${prefix}${
                    item.type ===
                    "directory"
                        ? "📁"
                        : "📄"
                } ${item.name}`
            );

            if (
                item.type ===
                "directory"
            ) {

                renderTree(
                    item.children,
                    prefix + "  "
                );

            }

        }
    );

}

function appendLine(
    text
) {

    const output =
        document.getElementById(
            "terminal-output"
        );

    const line =
        document.createElement(
            "div"
        );

    line.textContent =
        text;

    output.appendChild(
        line
    );

    output.scrollTop =
        output.scrollHeight;

}

function saveHistory(
    command
) {

    const history =
        JSON.parse(
            sessionStorage.getItem(
                "terminalHistory"
            ) || "[]"
        );

    history.push(
        command
    );

    sessionStorage.setItem(
        "terminalHistory",
        JSON.stringify(
            history
        )
    );

}

function renderHistory() {

    const history =
        JSON.parse(
            sessionStorage.getItem(
                "terminalHistory"
            ) || "[]"
        );

    history.forEach(
        (
            command
        ) => {

            appendLine(
                command
            );

        }
    );

}

export {
    executeCommand
};