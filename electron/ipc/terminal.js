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

            try {
                executeCommand(
                    command
                );
            } catch (error) {
                console.error("IPC terminal:execute Error in main process:", error);
                console.error(error.stack);
                throw error;
            }

        }

    );

    ipcMain.handle(

        "terminal:changeDirectory",

        async (

            event,

            path

        ) => {

            try {
                changeDirectory(
                    path
                );
            } catch (error) {
                console.error(`IPC terminal:changeDirectory Error in main process for path ${path}:`, error);
                console.error(error.stack);
                throw error;
            }

        }

    );

}

module.exports = {

    registerTerminalIPC

};