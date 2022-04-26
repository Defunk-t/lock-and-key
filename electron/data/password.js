const {join} = require('path');
const {cpus, totalmem} = require('os');

const {argon2id, hash, verify} = require('argon2');

const DATA_DIR = require('./data-directory.js');
const {FileCached} = require('./file.js');
const hashFile = FileCached(join(DATA_DIR, 'hash'));

/**
 * Argon2 options.
 */
const HASH_OPTIONS = (() => {
	const parallelism = cpus().length;
	return {
		type: argon2id,
		parallelism,
		memoryCost: Math.floor(totalmem() / 32000 / parallelism), // 1/32 system memory divided between threads
		timeCost: Math.floor((2 + Math.log(parallelism)) * parallelism * 1.5)
	};
})();

/**
 * Generate an Argon2 hash for the given password.
 * @param {string} password
 * @return Promise<string>
 */
function generateHash(password) {
	console.log("Doing a password hash.");
	const timestamp = Date.now();
	return hash(password, HASH_OPTIONS)
		.then(value => {
			console.log(`Hash took ${Date.now() - timestamp} ms.`);
			return value;
		});
}

/**
 * Check if the master password exists/is set.
 * @return Promise<boolean>
 */
module.exports.isSet = hashFile.isSet;


/**
 * Set or update the master password.
 * @param {string} password
 * @return Promise<void>
 */
module.exports.set = password =>
	generateHash(password).then(hashFile.set);

/**
 * Test the given password string against the hash.
 * @param {string} password
 * @return Promise<boolean>
 */
module.exports.test = password =>
	hashFile.get().then(value => verify(value, password));
