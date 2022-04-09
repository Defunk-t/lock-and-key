const {app, BrowserWindow} = require('electron');
const {isDataInitialised} = require('./userData.js');
const createWindow = require('./window');

const initialiseApp = () => createWindow(isDataInitialised() ? 'login' : 'setup')/*.then(window => window.webContents.openDevTools())*/;

// Called when Electron has finished initialising
app.whenReady().then(() => {

	initialiseApp();

	app.on('activate', () => {
		if (BrowserWindow.getAllWindows().length === 0) initialiseApp();
	});
});

app.on('window-all-closed', () => {
	// MacOS
	if (process.platform !== 'darwin') app.quit();
});
