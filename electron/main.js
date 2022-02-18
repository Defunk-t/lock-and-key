const {app, BrowserWindow} = require('electron');
const Path = require('path');
const FS = require('fs');

/**
 * File path strings and functions for finding user data.
 */
const userData = (directory => {
	return {
		/**
		 * Get the path to the encrypted secrets file for an account that a user has added.
		 * @param {int|string} id The ID of the account.
		 * @return string
		 */
		account: id => Path.join(directory, id),
		/**
		 * The path to the user's hashed password.
		 * @type string
		 */
		hash: Path.join(directory, "hash"),
		/**
		 * The path to the user's public key.
		 * @type string
		 */
		publicKey: Path.join(directory, "public"),
		/**
		 * The path to the user's encrypted private key.
		 * @type string
		 */
		privateKey: Path.join(directory, "private")
	};
})(app.getPath('userData'));

/**
 * Functions for creating windows.
 */
const Window = (() => {
	/**
	 * Creates a window with common setup options.
	 * @param {'app'|'login'|'setup'} name Name of an available window.
	 * @param {BrowserWindowConstructorOptions} [config] Additional browser window configuration options.
	 * @return {Promise<void>} Promise resolves after the window and file loads.
	 * @constructor
	 */
	const create = (name, config) => (window => window.loadFile(`src/html/${name}.html`).then(() => {
		if (process.env.NODE_ENV !== "production") window.webContents.openDevTools();
	}))(new BrowserWindow(Object.assign(config ?? {}, {
		webPreferences: Object.assign(config.webPreferences ?? {}, {
			preload: Path.join(__dirname, `preload/${name}.js`)
		})
	})));
	return {
		/**
		 * Create a login window.
		 * @return {Promise<void>} Promise resolves after the window and file loads.
		 * @constructor
		 */
		Login: () => create("login", {
			width: 360,
			height: 600
		}),
		/**
		 * Create a setup window.
		 * @return {Promise<void>} Promise resolves after the window and file loads.
		 * @constructor
		 */
		Setup: () => create("setup", {
			width: 360,
			height: 600
		}),
		/**
		 * Create an app window.
		 * @return {Promise<void>} Promise resolves after the window and file loads.
		 * @constructor
		 */
		App: () => create("app", {
			width: 1280,
			height: 720
		})
	};
})

/**
 * Loads either the setup window or the login window, depending on whether user config files are present.
 * @return void
 */
const initialiseApp = () => ((files, i) => {
	const testFile = err => {
		console.log(this);
		if (err) console.log(Window.Setup().then(() => console.log("Hello")));
		else if (++i === files.length) Window.Login();
		else FS.access(files[i], testFile);
	}
	testFile(files[i]);
})([userData.hash, userData.publicKey, userData.privateKey], -1);

// Called when Electron has finished initialization
app.whenReady().then(() => {

	initialiseApp();

	app.on('activate', () => {
		// On macOS, it's common to re-create a window in the app when the
		// dock icon is clicked and there are no other windows open (apparently.)
		if (BrowserWindow.getAllWindows().length === 0) initialiseApp();
	});
});

// On macOS, it's common for applications and their menu bar to stay
// active until the user quits explicitly with Cmd + Q (apparently.)
app.on('window-all-closed', () => {
	if (process.platform !== "darwin") app.quit();
});
