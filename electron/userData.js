const {join} = require('path');
const {accessSync} = require('fs');
const userDataDirectory = require('electron').app.getPath('userData');

/**
 * Path to the file containing the hashed password.
 * @type string
 */
const hashPath = join(userDataDirectory, 'hash');

/**
 * Path to the file containing the user's public key.
 * @type string
 */
const publicKeyPath = join(userDataDirectory, 'key_pub');

/**
 * Path to the file containing the user's private key.
 * @type string
 */
const privateKeyPath = join(userDataDirectory, 'key');

/**
 * Returns the path to the encrypted secrets file for a given account ID.
 * @param {*} id
 * @return string
 */
const getAccountFilePath = id => join(userDataDirectory, 'account', id);

const dataInitialised = (() => {
	try {
		return accessSync(hashPath) && accessSync(publicKeyPath) && accessSync(privateKeyPath);
	} catch (e) {
		return false;
	}
})();

/**
 * True if user has completed setup process, or false if not.
 * @return boolean
 */
module.exports.isDataInitialised = () => dataInitialised;