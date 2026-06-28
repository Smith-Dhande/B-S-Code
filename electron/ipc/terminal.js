const {
    ipcMain
} = require("electron");

const {

    createTerminal,

    executeCommand

} = require(
    "../services/terminal"
);

let mainWindow = null;

function registerTerminalIPC(
    window
) {

    mainWindow =
        window;

    createTerminal(

        (output) => {

            if (
                mainWindow &&
                !mainWindow.isDestroyed()
            ) {

                mainWindow.webContents.send(

                    "terminal:data",

                    output

                );

            }

        }

    );

    ipcMain.handle(

        "terminal:execute",

        async (

            event,

            command

        ) => {

            executeCommand(
                command
            );

        }

    );

}

module.exports = {

    registerTerminalIPC

};