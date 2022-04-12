const {join} = require('path');
const {BrowserWindow} = require('electron');

/**
 * Opens a browser window. Returns a Promise that fulfills with the BrowserWindow object.
 * @param {'app'|'login'|'setup'} windowName
 * @return Promise<Electron.CrossProcessExports.BrowserWindow>
 */
module.exports = windowName => {

	/**
	 * Browser window constructor options imported from the window's `config.json`.
	 * @type BrowserWindowConstructorOptions
	 */
	const config = (() => {
		switch (windowName) {
			case 'app':
			case 'login':
			case 'setup':
				// Import the config.json for the desired window
				return require(`./${windowName}/config.json`);
			default:
				throw TypeError(`Window name "${windowName}" is not recognised.`);
		}
	})();

	/**
	 * Window's preload script.
	 * @type string
	 */
	const preload = join(__dirname, windowName, 'preload.js');
	if (!config.webPreferences) config.webPreferences = {preload};
	else config.webPreferences.preload = preload;

	/**
	 * Browser window object, constructed with imported options plus the window's preload
	 * @type {Electron.CrossProcessExports.BrowserWindow}
	 */
	const window = new BrowserWindow(config);

	// Load the corresponding HTML for the window from the client folder
	// Returned promise fulfils with the BrowserWindow object
	return window.loadFile(`client/${windowName}/index.html`).then(() => window);
};
