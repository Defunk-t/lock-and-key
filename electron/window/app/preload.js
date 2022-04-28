const {contextBridge, ipcRenderer} = require('electron');

/**
 * @typedef IpcData
 * @property {function: Promise<?string>} get Retrieve the contents of the file.
 * @property {function(payload: string):Promise<void>} write Send a payload with which to overwrite the file.
 */

/**
 * Handles data file retrieval and writing.
 * @param {string} channelName
 * @return IpcData
 */
function ipcData(channelName) {
	return {
		get: () => ipcRenderer.invoke(`GET/${channelName}`),
		write: payload => ipcRenderer.invoke(`POST/${channelName}`, payload)
	};
}

contextBridge.exposeInMainWorld('API', {

	testPassword: password => ipcRenderer.invoke('POST/testPass', password),

	publicKey: ipcData('publicKey'),
	privateKey: ipcData('privateKey'),
	accountIndex: ipcData('accountIndex')
});
