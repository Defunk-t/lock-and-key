const {join} = require('path');
const {BrowserWindow, ipcMain} = require('electron');

/**
 * Opens a browser window. Returns a Promise that fulfills with the BrowserWindow object.
 * @param {'app'|'onboard'|'unlock'} windowType
 * @return Promise<Electron.CrossProcessExports.BrowserWindow>
 */
module.exports = createWindow = windowType => {

	/**
	 * Browser window constructor options imported from the window's `config.json`.
	 * @type BrowserWindowConstructorOptions
	 */
	const config = (() => {
		switch (windowType) {
			case 'app':
			case 'onboard':
			case 'unlock':
				// Import the config.json for the desired window
				return require(`./${windowType}/config.json`);
			default:
				throw TypeError(`Window name "${windowType}" is not recognised.`);
		}
	})();

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

	switch (windowType) {
		case 'unlock':
		case 'onboard':
			window.on('closed', () => ipcMain.removeHandler(windowType));
			ipcMain.handle(windowType, require(`./${windowType}/handler.js`)(window));
	}

	// Load the corresponding HTML for the window from the client folder
	// Returned promise fulfils with the BrowserWindow object
	return window.loadFile(`client/${windowType}.html`).then(() => window);
};
