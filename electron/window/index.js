const {join} = require('path');
const {BrowserWindow, ipcMain} = require('electron');
const Data = require('../data');

/**
 * Opens a browser window. Returns a Promise that fulfills with the BrowserWindow object.
 * @param {'app'|'onboard'} windowType
 * @return Promise<Electron.CrossProcessExports.BrowserWindow>
 */
const createWindow = windowType => {

	/**
	 * Browser window constructor options imported from the window's `config.json`.
	 * @type BrowserWindowConstructorOptions
	 */
	const config = require(`./${windowType}/config.json`);

	/**
	 * Window's preload script.
	 * @type string
	 */
	const preload = join(__dirname, windowType, 'preload.js');
	if (!config.webPreferences) config.webPreferences = {preload};
	else config.webPreferences.preload = preload;

	/**
	 * Browser window object, constructed with imported options plus the window's preload
	 * @type {Electron.CrossProcessExports.BrowserWindow}
	 */
	const window = new BrowserWindow(config);

	// Load the corresponding HTML for the window from the client folder
	// Returned promise fulfils with the BrowserWindow object
	return window.loadFile(`client/${windowType}/index.html`)
		.then(() => window);
};

const createAppWindow = () =>
	createWindow('app')
		.then(window => {

			ipcMain.handle('POST/testPass', (event, password) =>
				Data.testPassword(password)
			);

			ipcMain.handle('GET/privateKey', Data.getPrivateKey);
			ipcMain.handle('GET/publicKey', Data.getPublicKey);
			ipcMain.handleOnce('GET/accountIndex', Data.readAccountIndex);

			ipcMain.handle('POST/privateKey', (event, payload) =>
				Data.setPrivateKey(payload)
			);
			ipcMain.handle('POST/publicKey', (event, payload) =>
				Data.setPublicKey(payload)
			);
			ipcMain.handle('POST/accountIndex', (event, payload) =>
				Data.writeAccountIndex(payload)
			);

			return window.on('closed', () => {
				ipcMain.removeHandler('GET/privateKey');
				ipcMain.removeHandler('GET/publicKey');
				ipcMain.removeHandler('GET/accountIndex');
				ipcMain.removeHandler('POST/privateKey');
				ipcMain.removeHandler('POST/publicKey');
				ipcMain.removeHandler('POST/accountIndex');
			});
		});

const createOnboardWindow = () =>
	createWindow('onboard')
		.then(window => {
			ipcMain.handle('onboard', (event, password) =>
				Data.onboard(password)
					.then(createAppWindow)
					.then(() => window.destroy())
			);
			return window.on('closed', () => ipcMain.removeHandler('onboard'));
		});

module.exports = {
	createAppWindow,
	createOnboardWindow
};
