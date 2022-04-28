const {join} = require('path');

const DATA_DIR = require('./data-dir.js');
const {File} = require('./data-file.js');
const Password = require('./password.js');
const Keys = require('./keys.js');

const accountsIndexFile = File(join(DATA_DIR, 'index'));

/**
 * @type boolean
 */
let dataInitialised;

/**
 * Resolves true if user has completed setup process, or false if not.
 * @return Promise<boolean>
 */
module.exports.isInitialised = () =>
	new Promise(resolve => {
		if (!dataInitialised === undefined) resolve(dataInitialised);
		else Password.isSet().then(isSet => {
			if (!isSet) resolve(dataInitialised = isSet);
			else Keys.isSet().then(isSet =>
				resolve(dataInitialised = isSet));
		});
	});

/**
 * Set the master password and generate keys.
 * @param {string} password
 * @return Promise<void>
 */
module.exports.onboard = password =>
	new Promise(resolve => {
		let i = 0;
		function inc() {
			if (++i === 2) {
				resolve();
				console.log("All files written.");
			}
		}
		Password.set(password).then(inc);
		Keys.generate(password).then(data =>
			data.writePromise.then(inc));
	});

module.exports.testPassword = Password.test;

module.exports.getPrivateKey = Keys.getPrivateKey;
module.exports.getPublicKey = Keys.getPublicKey;
module.exports.setPrivateKey = Keys.setPrivateKey;
module.exports.setPublicKey = Keys.setPublicKey;

/**
 * Returns the raw content of the user's account index file or `NULL` if not exists.
 * @type {function: Promise<?string>}
 */
module.exports.readAccountIndex = accountsIndexFile.get;

/**
 * Overwrites the user's account index file with the string given.
 * @type {function(string): Promise<void>}
 */
module.exports.writeAccountIndex = accountsIndexFile.set;