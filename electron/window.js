const {join} = require('path');

const {BrowserWindow, ipcMain} = require('electron');

const {onboard, verifyPassword, read, write} = require('./data');

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

const createAppWindow = () => createWindow('app').then(window => {
	ipcMain.handle('POST/testPass', (event, password) => verifyPassword(password));
	ipcMain.handle('GET/file', (event, filename) => read(filename));
	ipcMain.handle('POST/file', (event, fileName, payload) => write(fileName, payload));
	return window.on('closed', () => {
		ipcMain.removeHandler('POST/testPass')
		ipcMain.removeHandler('GET/file');
		ipcMain.removeHandler('POST/file');
	});
});

const createOnboardWindow = () => createWindow('onboard').then(window => {
	ipcMain.handle('onboard', (event, password) =>
		onboard(password)
			.then(createAppWindow)
			.then(() => window.destroy())
	);
	return window.on('closed', () => ipcMain.removeHandler('onboard'));
});

module.exports = {
	createAppWindow,
	createOnboardWindow
};
