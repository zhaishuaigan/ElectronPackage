const { contextBridge, ipcRenderer } = require('electron')
const api = require('./api.js');
var allApi = {};

function addApi(name) {
    allApi[name] = (...args) => {
        return ipcRenderer.invoke(name, ...args);
    }
}
for (var name in api) {
    addApi(name);
}
contextBridge.exposeInMainWorld('api', allApi);
