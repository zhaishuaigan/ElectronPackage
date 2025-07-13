const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('node:path');
const api = require('./api.js');

global.app = app;
const createWindow = () => {
    const win = new BrowserWindow({
        width: 600,
        height: 950,
        frame: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js')
        }
    });
    // win.webContents.setWindowOpenHandler(({ url }) => {
    //     return {
    //         action: 'allow',
    //         overrideBrowserWindowOptions: {
    //             // width: 800,
    //             // height: 600,
    //             frame: false,
    //         }
    //     }
    // })

    win.loadFile('./index.html');
}


function registerApi(name, method) {
    ipcMain.handle(name, (event, ...args) => {
        return method(...args);
    });
}

app.whenReady().then(() => {
    for (var name in api) {
        registerApi(name, api[name]);
    }
    createWindow();
})