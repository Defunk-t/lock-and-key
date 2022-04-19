const {accessSync, mkdirSync, constants: fsConstants} = require('fs');
const {writeFile} = require('fs/promises');
const {join} = require('path');

const {generateKey} = require('openpgp');

const DATA_DIR = require('./data-directory.js');
const Password = require('./password.js')

// Create the directory if needed
mkdirSync(DATA_DIR, {recursive: true, mode: 0o700});


/**
 * Path to the file containing the user's public key.
 * @type string
 */
const PATH_KEY_PUBLIC = join(DATA_DIR, 'id_ecdsa.pub');

/**
 * Path to the file containing the user's encrypted private key.
 * @type string
 */
const PATH_KEY_PRIVATE = join(DATA_DIR, 'id_ecdsa');

/**
 * Returns the path to the encrypted secrets file for a given account ID.
 * @param {*} id
 * @return string
 */
const getAccountFilePath = id => join(DATA_DIR, 'account', id);

/**
 * @type boolean
 */
let dataInitialised;

/**
 * Resolves true if user has completed setup process, or false if not.
 * @return Promise<boolean>
 */
module.exports.isDataInitialised = () => new Promise(resolve => {
	if (!dataInitialised === undefined) resolve(dataInitialised);
	else Password.isSet()
		.then(isPasswordSet => {
			if (!isPasswordSet) resolve(dataInitialised = false);
			else {
				try {
					accessSync(PATH_KEY_PUBLIC, fsConstants.R_OK);
					accessSync(PATH_KEY_PRIVATE, fsConstants.R_OK);
				} catch (e) {
					resolve(dataInitialised = false);
				}
				resolve(dataInitialised = true);
			}
		});
});

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
			console.log(`Writing to ${file}`);
			writeFile(file, value, {mode: 0o400}).then(() => {
				if (callback && ++i === 2) callback();
			});
		};

		write(PATH_KEY_PRIVATE, keyPair.privateKey);
		write(PATH_KEY_PUBLIC,  keyPair.publicKey );

		return keyPair;
	});
}

/**
 * Set the master password and generate keys.
 * @param {string} password
 * @return Promise<void>
 */
module.exports.onboard = password =>
	new Promise(resolve => {
		let i = 0;
		function inc() {
			if (++i === 2) resolve();
		}
		Password.set(password).then(inc);
		createKeys(password).then(inc);
	});

/**
 * Test the given password string against the hash.
 * @param {string} password
 * @return Promise<boolean>
 */
module.exports.unlock = Password.test;
