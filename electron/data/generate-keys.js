const {generateKey, KeyPair} = require('openpgp');

const {write} = require('./file.js');

/**
 * Generate PGP keys using the passphrase and write to disk.
 * @param {string} passphrase
 * @returns {Promise<{writePromise:Promise<void>,value:KeyPair}>}
 */
module.exports = passphrase => {

	// TODO: move to client

	console.log("Generating keys.");
	const timestamp = Date.now();

	return generateKey({
		type: 'ecc',
		curve: 'curve25519',
		userIDs: [{}],
		passphrase,
		format: 'armored'
	}).then(value => {

		console.log(`Key generation took ${Date.now() - timestamp} ms.`);

		/**
		 * Resolves once the keys have been written to the disk.
		 * @type {Promise<void>}
		 */
		const writePromise = new Promise(resolve => {
			let i = 0;
			['privateKey', 'publicKey'].forEach(fileName => write(fileName, value[fileName]).then(() => {
				if (++i === 2) resolve();
			}));
		})

		return {
			value,
			writePromise
		};
	});
};
