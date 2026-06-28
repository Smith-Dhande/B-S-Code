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