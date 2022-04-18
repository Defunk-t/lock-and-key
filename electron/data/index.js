// Node.js
const {accessSync, mkdirSync} = require('fs');
const {R_OK} = require('fs').constants;
const {writeFile} = require('fs/promises');
const {join} = require('path');
const {cpus, totalmem} = require('os');

// 3rd party
const {argon2id, hash} = require('argon2');
const {generateKey} = require('openpgp');

/**
 * The directory where user's data for this app is stored.
 * @type string
 */
const userDataDirectory = join(require('electron').app.getPath('home'), '.lock-and-key');

// Create the directory if needed
mkdirSync(userDataDirectory, {recursive: true, mode: 0o700});

/**
 * Path to the file containing the hashed password.
 * @type string
 */
const PATH_HASH = join(userDataDirectory, 'hash');

/**
 * Path to the file containing the user's public key.
 * @type string
 */
const PATH_KEY_PUBLIC = join(userDataDirectory, 'id_ecdsa.pub');

/**
 * Path to the file containing the user's encrypted private key.
 * @type string
 */
const PATH_KEY_PRIVATE = join(userDataDirectory, 'id_ecdsa');

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
		accessSync(PATH_HASH,        R_OK);
		accessSync(PATH_KEY_PUBLIC,  R_OK);
		accessSync(PATH_KEY_PRIVATE, R_OK);
		return true;
	} catch (e) {
		return false;
	}
})();

function createHash(password) {

	console.log("Doing a password hash.");

	const parallelism = cpus().length;
	const timestamp = Date.now();

	return hash(password, {
		type: argon2id,
		parallelism,
		memoryCost: Math.floor(totalmem() / 32000 / parallelism), // 1/32 system memory divided between threads
		timeCost: Math.floor((2 + Math.log(parallelism)) * parallelism * 1.5)
	}).then(value => {
		console.log(`Hash took ${Date.now() - timestamp} ms.\nWriting to ${PATH_HASH}`);
		return writeFile(PATH_HASH, value, {mode: 0o400});
	}).then(() => console.log("Hash file written."));
}

function createKeys(passphrase, callback) {

	console.log("Generating keys.");
	const timestamp = Date.now();

	return generateKey({
		type: 'ecc',
		curve: 'curve25519',
		userIDs: [{}],
		passphrase,
		format: 'armored'
	}).then(keyPair => {

		console.log(`Key generation took ${Date.now() - timestamp} ms.`);

		// Call the callback function after both files are written
		let i = 0;

		const write = (file, value) => {
			console.log(`Writing to ${file}.`);
			writeFile(file, value, {mode: 0o400}).then(() => {
				console.log(`${file} written.`);
				if (callback && ++i === 2) callback();
			});
		};

		write(PATH_KEY_PRIVATE, keyPair.privateKey);
		write(PATH_KEY_PUBLIC,  keyPair.publicKey );

		return keyPair;
	});
}

/**
 * @param {string} password
 * @return Promise<void>
 */
module.exports.onboard = password =>
	createKeys(password) && createHash(password);

/**
 * TODO
 * @param {string} password
 * @return false
 */
module.exports.unlock = password => false;
