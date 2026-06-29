const {
    ipcMain
} = require(
    "electron"
);

const {

    isGitRepository,

    getCurrentBranch,

    getGitStatus

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

            return await isGitRepository(

                projectPath

            );

        }

    );

    ipcMain.handle(

        "git:getBranch",

        async (

            event,

            projectPath

        ) => {

            return await getCurrentBranch(

                projectPath

            );

        }

    );

    ipcMain.handle(

        "git:getStatus",

        async (

            event,

            projectPath

        ) => {

            return await getGitStatus(

                projectPath

            );

        }

    );

}

module.exports = {

    registerGitIPC

};