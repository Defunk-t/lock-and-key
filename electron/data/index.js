// Node.js
const {accessSync} = require('fs');
const {writeFile} = require('fs/promises');
const {join} = require('path');
const {cpus, totalmem} = require('os');

// 3rd party
const {argon2id, hash} = require('argon2');
const {} = require('openpgp');


/**
 * The directory where user's data for this app is stored.
 * @type string
 */
const userDataDirectory = require('electron').app.getPath('userData');

/**
 * Path to the file containing the hashed password.
 * @type string
 */
const PATH_HASH = join(userDataDirectory, 'hash');

/**
 * Path to the file containing the user's public key.
 * @type string
 */
const PATH_KEY_PUBLIC = join(userDataDirectory, 'key_pub');

/**
 * Path to the file containing the user's private key.
 * @type string
 */
const PATH_KEY_PRIVATE = join(userDataDirectory, 'key');

/**
 * Returns the path to the encrypted secrets file for a given account ID.
 * @param {*} id
 * @return string
 */
const getAccountFilePath = id => join(userDataDirectory, 'account', id);

/**
 * True if user has completed setup process, or false if not.
 * @return boolean
 */
module.exports.isDataInitialised = (() => {
	try {
		return accessSync(PATH_HASH) && accessSync(PATH_KEY_PUBLIC) && accessSync(PATH_KEY_PRIVATE);
	} catch (e) {
		return false;
	}
})();

module.exports.setHash = password => {

	console.log("Doing a hash.");

	const parallelism = cpus().length;
	const timestamp = Date.now();

	return hash(password, {
		type: argon2id,
		parallelism,
		memoryCost: Math.floor(totalmem() / 32000 / parallelism), // 1/32 system memory divided between threads
		timeCost: Math.floor(2 + Math.log(parallelism) * parallelism)
	}).then(value => {
		console.log(`Hash took ${Date.now() - timestamp} ms.`);
		return writeFile(PATH_HASH, value);
	});
};
