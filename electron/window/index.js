const {join} = require('path');
const {BrowserWindow} = require('electron');

/**
 * Opens a browser window.
 * @param {'app'|'login'|'setup'} windowName
 * @return Promise<Electron.CrossProcessExports.BrowserWindow>
 */
module.exports = windowName => {

	const config = (() => {
		switch (windowName) {
			case 'app':
			case 'login':
			case 'setup':
				return require(`./${windowName}/config.json`);
			default:
				throw TypeError(`Window name "${windowName}" is not recognised.`);
		}
	})();

	return (window =>
		window.loadFile(`app/html/${windowName}.html`).then(() => window)
	)(new BrowserWindow(Object.assign(config, {
		webPreferences: Object.assign(config.webPreferences ?? {}, {
			preload: join(__dirname, windowName, 'preload.js')
		})
	})));
};
