const {app, BrowserWindow, ipcMain} = require('electron');
const createWindow = require('./window');
const Data = require('./data');

/**
 * Opens the 'onboard' or 'setup' window, depending on whether the user's data has yet been initialised.
 * @return Promise<Electron.CrossProcessExports.BrowserWindow>
 */
const initWindow = () => new Promise(resolve => {

	/**
	 * @type 'unlock'|'onboard'
	 */
	let windowType;

	Data.isInitialised()
		.then(isInit => windowType = isInit ? 'unlock' : 'onboard')
		.then(createWindow)
		.then(window => {
			resolve(window);

			// this handler stuff should probably be put into createWindow function

			window.on('closed', () => ipcMain.removeHandler(windowType));
			ipcMain.handle(windowType, windowType === 'unlock' ? (event, password) =>
				Data.testPassword(password)
					.then(pwValid => {
						if (pwValid) createWindow('app')
							.then(() => window.destroy());
						return pwValid;
					})
			: (event, password) =>
				Data.onboard(password)
					.then(() => createWindow('app'))
					.then(() => window.destroy())
			);

			return window;
		});
});

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
