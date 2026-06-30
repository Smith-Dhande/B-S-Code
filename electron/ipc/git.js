const {
    ipcMain
} = require(
    "electron"
);

const {

    isGitRepository,

    getCurrentBranch,

    getGitStatus,

    commit

} = require(
    "../services/git"
);

function registerGitIPC() {

    ipcMain.handle(

        "git:isRepository",

        async (

            event,

            projectPath

        ) => {

            try {
                return await isGitRepository(

                    projectPath

                );
            } catch (error) {
                console.error("IPC git:isRepository Error in main process:", error);
                console.error(error.stack);
                throw error;
            }

        }

    );

    ipcMain.handle(

        "git:getBranch",

        async (

            event,

            projectPath

        ) => {

            try {
                return await getCurrentBranch(

                    projectPath

                );
            } catch (error) {
                console.error("IPC git:getBranch Error in main process:", error);
                console.error(error.stack);
                throw error;
            }

        }

    );

    ipcMain.handle(

        "git:getStatus",

        async (

            event,

            projectPath

        ) => {

            try {
                return await getGitStatus(

                    projectPath

                );
            } catch (error) {
                console.error("IPC git:getStatus Error in main process:", error);
                console.error(error.stack);
                throw error;
            }

        }

    );

    ipcMain.handle(

        "git:commit",

        async (

            event,

            projectPath,

            message

        ) => {

            try {
                return await commit(

                    projectPath,

                    message

                );
            } catch (error) {
                console.error("IPC git:commit Error in main process:", error);
                console.error(error.stack);
                throw error;
            }

        }

    );

}

module.exports = {

    registerGitIPC

};