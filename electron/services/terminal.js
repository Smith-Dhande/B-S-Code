const { spawn } = require("child_process");

let terminalProcess = null;

function createTerminal(onOutput) {

    if (terminalProcess) {

        return terminalProcess;

    }

    terminalProcess = spawn(

        process.platform === "win32"
            ? "powershell.exe"
            : "bash",

        [],

        {

            cwd: process.cwd(),

            shell: true

        }

    );

    terminalProcess.stdout.on(

        "data",

        (data) => {

            onOutput(
                data.toString()
            );

        }

    );

    terminalProcess.stderr.on(

        "data",

        (data) => {

            onOutput(
                data.toString()
            );

        }

    );

    terminalProcess.on(

        "close",

        () => {

            terminalProcess = null;

        }

    );

    return terminalProcess;

}

function executeCommand(command) {

    if (
        !terminalProcess
    ) {

        return;

    }

    terminalProcess.stdin.write(

        command + "\n"

    );

}

function changeDirectory(path) {

    if (
        !terminalProcess
    ) {

        return;

    }

    if (
        process.platform === "win32"
    ) {

        terminalProcess.stdin.write(

            `cd "${path}"\n`

        );

    }

    else {

        terminalProcess.stdin.write(

            `cd "${path}"\n`

        );

    }

}

module.exports = {

    createTerminal,

    executeCommand,

    changeDirectory

};