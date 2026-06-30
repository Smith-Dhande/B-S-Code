const {
    ipcMain
} = require("electron");

const {

    openFolder,

    readDirectory

} = require(
    "../services/filesystem"
);

function registerFilesystemIPC() {

    ipcMain.handle(

        "filesystem:openFolder",

        async () => {

            return await openFolder();

        }

    );

    ipcMain.handle(

        "filesystem:readDirectory",

        async (

            event,

            directoryPath

        ) => {

            return await readDirectory(

                directoryPath

            );

        }

    );

}

module.exports = {

    registerFilesystemIPC

};