const {join} = require('path');
const {readFile, writeFile, rm} = require('fs/promises');
const {cpus, totalmem} = require('os');

const {argon2id, hash, verify} = require('argon2');

const DATA_DIR = require('./data-directory.js')

/**
 * Location of the password hash file.
 * @type string
 */
const HASH_PATH = join(DATA_DIR, 'hash');

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
 * The current password hash.
 * @type ?string
 */
let currentHash;

/**
 * Read the hash file.
 * Returns a string with the contents or NULL if it does not exist.
 * @return Promise<?string>
 */
const readHash = () =>
	readFile(HASH_PATH, 'utf8')
		.then(data => data, () => null);

/**
 * Get the current hash value.
 * Hash is read from file, and then stored in memory for subsequent calls.
 * Returns a string with the contents or NULL if it does not exist.
 * @return Promise<?string>
 */
const getHash = () =>
	!!currentHash ? new Promise(resolve => resolve(currentHash)) : readHash().then(data => currentHash = data);

/**
 * Generate an Argon2 hash for the given password.
 * @param {string} password
 * @return Promise<string>
 */
function generateHash(password) {
	console.log("Doing a password hash.");
	const timestamp = Date.now();
	return hash(password, HASH_OPTIONS)
		.then(hash => {
			console.log(`Hash took ${Date.now() - timestamp} ms.`);
			currentHash = hash;
			return hash;
		});
}

/**
 * Write/overwrite the hash file with the given string.
 * @param {string} hash
 * @return Promise<void>
 */
function writeHash(hash) {
	console.log(`Writing to ${HASH_PATH}`);
	const write = () => writeFile(HASH_PATH, hash, {mode: 0o400});
	return rm(HASH_PATH).then(write, write);
}

/**
 * Check if the master password exists/is set.
 * @return Promise<boolean>
 */
module.exports.isSet = () =>
	getHash().then(hash => !!hash);

/**
 * Set or update the master password.
 * @param {string} password
 * @return Promise<void>
 */
module.exports.set = password =>
	generateHash(password)
		.then(writeHash);

/**
 * Test the given password string against the hash.
 * @param {string} password
 * @return Promise<boolean>
 */
module.exports.test = password =>
	getHash().then(hash => verify(hash, password));
