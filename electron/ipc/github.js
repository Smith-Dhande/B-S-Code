const { ipcMain, shell } = require("electron");
const {
    checkGitHubAuth,
    requestDeviceCode,
    pollForToken,
    createRepo,
    publishProject,
    deleteStoredToken
} = require("../services/github");

function registerGitHubIPC() {
    ipcMain.handle("github:checkAuth", async () => {
        try {
            return await checkGitHubAuth();
        } catch (error) {
            console.error("IPC github:checkAuth Error:", error);
            throw error;
        }
    });

    ipcMain.handle("github:requestDeviceCode", async () => {
        try {
            return await requestDeviceCode();
        } catch (error) {
            console.error("IPC github:requestDeviceCode Error:", error);
            throw error;
        }
    });

    ipcMain.handle("github:pollForToken", async (event, deviceCode, intervalSeconds) => {
        try {
            return await pollForToken(deviceCode, intervalSeconds);
        } catch (error) {
            console.error("IPC github:pollForToken Error:", error);
            throw error;
        }
    });

    ipcMain.handle("github:createRepo", async (event, repoName, isPrivate) => {
        try {
            return await createRepo(repoName, isPrivate);
        } catch (error) {
            console.error("IPC github:createRepo Error:", error);
            throw error;
        }
    });

    ipcMain.handle("github:publishProject", async (event, projectPath, repoName, isPrivate, cloneUrl) => {
        try {
            return await publishProject(projectPath, repoName, isPrivate, cloneUrl);
        } catch (error) {
            console.error("IPC github:publishProject Error:", error);
            throw error;
        }
    });

    ipcMain.handle("github:openExternal", async (event, url) => {
        try {
            await shell.openExternal(url);
            return true;
        } catch (error) {
            console.error("IPC github:openExternal Error:", error);
            throw error;
        }
    });

    ipcMain.handle("github:logout", async () => {
        try {
            await deleteStoredToken();
            return true;
        } catch (error) {
            console.error("IPC github:logout Error:", error);
            throw error;
        }
    });
}

module.exports = {
    registerGitHubIPC
};
