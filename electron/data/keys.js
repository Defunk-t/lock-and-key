const {join} = require('path');

const {generateKey} = require('openpgp');

const DATA_DIR = require('./data-dir.js');
const {FileCached} = require('./data-file.js');
const privateKeyFile = FileCached(join(DATA_DIR, 'id_ecdsa'));
const publicKeyFile  = FileCached(join(DATA_DIR, 'id_ecdsa.pub'));

const generate = passphrase => {

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

/**
 * Check if keys have been generated.
 * @return Promise<boolean>
 */
const isSet = () => new Promise(resolve => {

	let i = 0;
	let resolved = false;

	const doResolve = value => {
		resolved = true;
		resolve(value);
	};

	const test = key => {
		if (!resolved) {
			if (!key) doResolve(false);
			else if (++i === 2) doResolve(true);
		}
	};

	privateKeyFile.get().then(test);
	publicKeyFile.get().then(test);
});

module.exports = {
	generate,
	getPrivateKey: privateKeyFile.get,
	setPrivateKey: privateKeyFile.set,
	getPublicKey: publicKeyFile.get,
	setPublicKey: publicKeyFile.set,
	isSet
};
