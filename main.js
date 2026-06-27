const { app, BrowserWindow } = require("electron");
const path = require("path");

function createWindow() {
    const window = new BrowserWindow({ 
        width: 1600, 
        height: 900,
        minWidth: 1200,
        minHeight: 700,
        autoHideMenuBar: true,
        webPreferences: {
                contextIsolation: true,
                nodeIntegration: false
            }

        });

    window.loadFile(
        path.join(__dirname,"index.html")
    );

}

app.whenReady().then(createWindow);

app.on("window-all-closed",() => {

        if (
            process.platform !== "darwin"
        ) {
            app.quit();
        }

    }
);

app.on("activate",() => {
        if (
            BrowserWindow
                .getAllWindows()
                .length === 0
        ) {
            createWindow();
        }

    }
);