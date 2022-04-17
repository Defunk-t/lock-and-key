const {app, BrowserWindow, ipcMain} = require('electron');
const {isDataInitialised, setHash} = require('./data');
const createWindow = require('./window');

if (!isDataInitialised) ipcMain.handleOnce('onboard', (event, password) => setHash(password));

/**
 * Opens the 'login' or 'setup' window, depending on whether the user's data has yet been initialised.
 * @return Promise<Electron.CrossProcessExports.BrowserWindow>
 */
const initialiseWindow = () => createWindow(isDataInitialised ? 'unlock' : 'setup')/*.then(window => window.webContents.openDevTools())*/;

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
