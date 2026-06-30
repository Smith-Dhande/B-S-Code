const {
    contextBridge,
    ipcRenderer
} = require("electron");

contextBridge.exposeInMainWorld(

    "terminal",

    {

        execute(
            command
        ) {

            return ipcRenderer.invoke(

                "terminal:execute",

                command

            );

        },

        changeDirectory(
            path
        ) {

            return ipcRenderer.invoke(

                "terminal:changeDirectory",

                path

            );

        },

        onOutput(
            callback
        ) {

            ipcRenderer.on(

                "terminal:data",

                (

                    event,

                    data

                ) => {

                    callback(
                        data
                    );

                }

            );

        }

    }

);

contextBridge.exposeInMainWorld(

    "git",

    {

        isRepository(
            projectPath
        ) {

            return ipcRenderer.invoke(

                "git:isRepository",

                projectPath

            );

        },

        getBranch(
            projectPath
        ) {

            return ipcRenderer.invoke(

                "git:getBranch",

                projectPath

            );

        },

        getStatus(
            projectPath
        ) {

            return ipcRenderer.invoke(

                "git:getStatus",

                projectPath

            );

        },

        commit(
            projectPath,
            message
        ) {

            return ipcRenderer.invoke(

                "git:commit",

                projectPath,

                message

            );

        },

        init(projectPath) {
            return ipcRenderer.invoke("git:init", projectPath);
        },

        clone(repoUrl, parentPath) {
            return ipcRenderer.invoke("git:clone", repoUrl, parentPath);
        },

        commitSelected(projectPath, message, files) {
            return ipcRenderer.invoke("git:commitSelected", projectPath, message, files);
        },

        checkGitInstalled() {
            return ipcRenderer.invoke("git:checkInstalled");
        }

    }

);

contextBridge.exposeInMainWorld(
    "github",
    {
        checkAuth() {
            return ipcRenderer.invoke("github:checkAuth");
        },
        requestDeviceCode() {
            return ipcRenderer.invoke("github:requestDeviceCode");
        },
        pollForToken(deviceCode, intervalSeconds) {
            return ipcRenderer.invoke("github:pollForToken", deviceCode, intervalSeconds);
        },
        createRepo(repoName, isPrivate) {
            return ipcRenderer.invoke("github:createRepo", repoName, isPrivate);
        },
        publishProject(projectPath, repoName, isPrivate, cloneUrl) {
            return ipcRenderer.invoke("github:publishProject", projectPath, repoName, isPrivate, cloneUrl);
        },
        openExternal(url) {
            return ipcRenderer.invoke("github:openExternal", url);
        },
        logout() {
            return ipcRenderer.invoke("github:logout");
        }
    }
);

contextBridge.exposeInMainWorld(

    "filesystem",

    {

        openFolder() {

            return ipcRenderer.invoke(

                "filesystem:openFolder"

            );

        },

        readDirectory(
            directoryPath
        ) {

            return ipcRenderer.invoke(

                "filesystem:readDirectory",

                directoryPath

            );

        }

    }

);