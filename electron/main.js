const {app, BrowserWindow, ipcMain} = require('electron');
const {isDataInitialised, onboard, unlock} = require('./data');
const createWindow = require('./window');

/**
 * Opens the 'unlock' or 'setup' window, depending on whether the user's data has yet been initialised.
 * @return Promise<Electron.CrossProcessExports.BrowserWindow>
 */
function initWindow() {

	const WINDOW  = isDataInitialised ? 'unlock' : 'setup'  ;
	const EVENT   = isDataInitialised ?  WINDOW  : 'onboard';
	const HANDLER = isDataInitialised ?  unlock  :  onboard ;

	ipcMain.handle(EVENT, (event, password) => HANDLER(password));

	createWindow(WINDOW).then(window =>
		window.on('close', () => ipcMain.removeHandler(WINDOW)));
}

// Called when Electron has finished initialising
app.whenReady().then(() => {

	// Open initial window
	initWindow();

	// Set Electron to re-open initial window when app activates with no windows open (i.e. activated from the system tray)
	app.on('activate', () => {
		if (BrowserWindow.getAllWindows().length === 0) initWindow();
	});
});

// Exit app when all windows are closed except on macOS
app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') app.quit();
});
