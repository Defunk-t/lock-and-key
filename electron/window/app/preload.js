const {contextBridge, ipcRenderer} = require('electron');

contextBridge.exposeInMainWorld('API', {
	getAccountIndex: () => ipcRenderer.invoke('get/accountIndex'),
	writeAccountIndex: payload => ipcRenderer.invoke('write/accountIndex', payload),
	unlock: password => ipcRenderer.invoke('unlock', password)
});
