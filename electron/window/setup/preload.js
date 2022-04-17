const {contextBridge, ipcRenderer} = require('electron');

contextBridge.exposeInMainWorld('API', {
	onboard: password => ipcRenderer.invoke('onboard', password)
});
