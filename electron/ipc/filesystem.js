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

            try {
                return await openFolder();
            } catch (error) {
                console.error("IPC filesystem:openFolder Error in main process:", error);
                console.error(error.stack);
                throw error;
            }

        }

    );

    ipcMain.handle(

        "filesystem:readDirectory",

        async (

            event,

            directoryPath

        ) => {

            try {
                return await readDirectory(

                    directoryPath

                );
            } catch (error) {
                console.error(`IPC filesystem:readDirectory Error in main process for path ${directoryPath}:`, error);
                console.error(error.stack);
                throw error;
            }

        }

    );

}

module.exports = {

    registerFilesystemIPC

};