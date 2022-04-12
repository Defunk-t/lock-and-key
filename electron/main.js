const {app, BrowserWindow} = require('electron');
const {isDataInitialised} = require('./userData.js');
const createWindow = require('./window');

/**
 * Opens the 'login' or 'setup' window, depending on whether the user's data has yet been initialised.
 * @return Promise<Electron.CrossProcessExports.BrowserWindow>
 */
const initialiseWindow = () => createWindow(isDataInitialised() ? 'login' : 'setup')/*.then(window => window.webContents.openDevTools())*/;

// Called when Electron has finished initialising
app.whenReady().then(() => {

	// Open initial window
	initialiseWindow();

	// Set Electron to re-open initial window when app activates with no windows open (i.e. activated from the system tray)
	app.on('activate', () => {
		if (BrowserWindow.getAllWindows().length === 0) initialiseWindow();
	});
});

// Exit app when all windows are closed except on macOS
app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') app.quit();
});
