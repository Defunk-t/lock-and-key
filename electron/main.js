const {app, BrowserWindow, ipcMain} = require('electron');
const {isDataInitialised, onboard, unlock} = require('./data');
const createWindow = require('./window');

/**
 * Opens the 'unlock' or 'setup' window, depending on whether the user's data has yet been initialised.
 * @return Promise<Electron.CrossProcessExports.BrowserWindow>
 */
const initWindow = () => new Promise(resolve => isDataInitialised().then(DATA_INIT => {

	const WINDOW  = DATA_INIT ? 'unlock' : 'setup'  ;
	const EVENT   = DATA_INIT ?  WINDOW  : 'onboard';
	const HANDLER = DATA_INIT ?  unlock  :  onboard ;

	ipcMain.handle(EVENT, (event, password) => HANDLER(password));

	createWindow(WINDOW).then(window => {
		resolve(window);
		window.on('close', () => ipcMain.removeHandler(WINDOW));
	});
}));

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
