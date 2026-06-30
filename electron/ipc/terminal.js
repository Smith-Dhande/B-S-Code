const {
    ipcMain
} = require("electron");

const {

    createTerminal,

    executeCommand,

    changeDirectory

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

    ipcMain.handle(

        "terminal:changeDirectory",

        async (

            event,

            path

        ) => {

            changeDirectory(
                path
            );

        }

    );

}

module.exports = {

    registerTerminalIPC

};