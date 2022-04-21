const {contextBridge, ipcRenderer} = require('electron');

contextBridge.exposeInMainWorld('API', {
	unlock: password => ipcRenderer.invoke('unlock', password)
});
