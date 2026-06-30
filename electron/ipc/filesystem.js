const {
    ipcMain,
    dialog
} = require("electron");

function registerFilesystemIPC() {

    ipcMain.handle(

        "filesystem:openFolder",

        async () => {

            const result =
                await dialog.showOpenDialog({

                    properties: [
                        "openDirectory"
                    ]

                });

            if (
                result.canceled
            ) {

                return null;

            }

            return {

                path:
                    result.filePaths[0]

            };

        }

    );

}

module.exports = {

    registerFilesystemIPC

};