const {app, BrowserWindow} = require('electron');
const {createOnboardWindow, createAppWindow} = require('./window');
const Data = require('./data');

/**
 * Opens the 'onboard' or 'setup' window, depending on whether the user's data has yet been initialised.
 * @return Promise<Electron.CrossProcessExports.BrowserWindow>
 */
const initWindow = () =>
	Data.isInitialised()
		.then(isInit => isInit ? createAppWindow() : createOnboardWindow());

// Called when Electron has finished initialising
app.whenReady().then(() => {

	// Open initial window
	initWindow();

	// Set Electron to re-open initial window when app activates with no windows open
	// (i.e. activated from the system tray)
	app.on('activate', () => {
		if (BrowserWindow.getAllWindows().length === 0) initWindow();
	});
});

// Exit app when all windows are closed except on macOS
app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') app.quit();
});
