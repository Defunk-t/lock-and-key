const {app, BrowserWindow} = require('electron');
const {createOnboardWindow, createAppWindow} = require('./window');
const {isInitialised} = require('./data');

/**
 * Opens the 'onboard' or 'app' window, depending on whether the user's data has yet been initialised.
 * @return Promise<Electron.CrossProcessExports.BrowserWindow>
 */
const initWindow = () => isInitialised().then(isInit => isInit ? createAppWindow() : createOnboardWindow());

app.whenReady().then(() => {

	initWindow();

	// Launch a new window when app activates with no windows open
	// (i.e. activated from the system tray)
	app.on('activate', () => {
		if (BrowserWindow.getAllWindows().length === 0) initWindow();
	});
});

// Exit app when all windows are closed except on macOS
app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') app.quit();
});
