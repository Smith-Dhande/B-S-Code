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