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

        }

    }

);