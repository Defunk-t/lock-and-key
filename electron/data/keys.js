const {join} = require('path');

const {generateKey, readPrivateKey, decryptKey, encryptKey} = require('openpgp');

const DATA_DIR = require('./data-directory.js');
const {FileCached} = require('./file.js');
const privateKeyFile = FileCached(join(DATA_DIR, 'id_ecdsa'));
const publicKeyFile  = FileCached(join(DATA_DIR, 'id_ecdsa.pub'));

/**
 * Check if keys have been generated.
 * @return Promise<boolean>
 */
module.exports.areGenerated = privateKeyFile.isSet;

module.exports.generate = passphrase => {

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

		/**
		 * Resolves once the keys have been written to the disk.
		 * @type {Promise<void>}
		 */
		const writePromise = new Promise(resolve => {

			let i = 0;
			function inc() {
				if (++i === 2) resolve();
			}

			privateKeyFile.set(keyPair.privateKey).then(inc);
			publicKeyFile.set(keyPair.publicKey).then(inc);
		});


		return {
			privateKey: keyPair.privateKey,
			publicKey: keyPair.publicKey,
			writePromise
		};
	});
};

const decryptPrivateKey = passphrase =>
	privateKeyFile.get()
		.then(armoredKey => readPrivateKey({
			armoredKey
		}))
		.then(privateKey => decryptKey({
			privateKey,
			passphrase
		}));

const setPassphrase = (oldPassphrase, newPassphrase) =>
	decryptPrivateKey(oldPassphrase)
		.then(privateKey => encryptKey({
			privateKey,
			passphrase: newPassphrase
		}));

module.exports.decryptKey = decryptPrivateKey;
