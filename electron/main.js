const {app, BrowserWindow} = require("electron");
const path = require("path");

/**
 * Creates a browser window.
 */
function createWindow () {

	const w = new BrowserWindow({
		width: 1280,
		height: 720,
		webPreferences: {
		  preload: path.join(__dirname, "preload.js")
		}
	});

	w.loadFile("src/index.html").then(() => {
		if (process.env.NODE_ENV !== "production") {
			w.webContents.openDevTools();
			console.log("App initialised.");
		}
	});

}

// Called when Electron has finished initialization
app.whenReady().then(() => {

	createWindow();

	app.on('activate', () => {
		// On macOS, it's common to re-create a window in the app when the
		// dock icon is clicked and there are no other windows open (apparently.)
		if (BrowserWindow.getAllWindows().length === 0) createWindow();
	});
});

// On macOS, it's common for applications and their menu bar to stay
// active until the user quits explicitly with Cmd + Q (apparently.)
app.on('window-all-closed', () => {
	if (process.platform !== "darwin") app.quit();
});
