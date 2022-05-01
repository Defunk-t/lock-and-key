const {contextBridge, ipcRenderer} = require('electron');

contextBridge.exposeInMainWorld('API', {
	testPassword: password => ipcRenderer.invoke('POST/testPass', password),
	readFile: fileName => ipcRenderer.invoke('GET/file', fileName),
	writeFile: (fileName, payload) => ipcRenderer.invoke('POST/file', fileName, payload),
});
