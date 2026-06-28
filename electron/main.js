const {
    app,
    BrowserWindow
} = require("electron");

const path = require("path");

const {
    registerTerminalIPC
} = require("./ipc/terminal");

let mainWindow = null;

function createWindow() {

    mainWindow =
        new BrowserWindow({

            width: 1600,

            height: 900,

            minWidth: 1200,

            minHeight: 700,

            autoHideMenuBar: true,

            webPreferences: {

                preload:
                    path.join(
                        __dirname,
                        "preload.js"
                    ),

                contextIsolation: true,

                nodeIntegration: false

            }

        });

    mainWindow.loadFile(

        path.join(
            __dirname,
            "..",
            "index.html"

        )

    );

    registerTerminalIPC(
        mainWindow
    );

}

app.whenReady().then(() => {

    createWindow();

});

app.on(
    "window-all-closed",
    () => {

        if (
            process.platform !==
            "darwin"
        ) {

            app.quit();

        }

    }
);

app.on(
    "activate",
    () => {

        if (
            BrowserWindow
                .getAllWindows()
                .length === 0
        ) {

            createWindow();

        }

    }
);