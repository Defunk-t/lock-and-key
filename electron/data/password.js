const {cpus, totalmem} = require('os');

const {argon2id, hash, verify} = require('argon2');

const {FileCached, write} = require('./file.js');

/**
 * @type FileCached
 */
let hashFile;

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
 * @return {Promise<{writePromise:Promise<void>,value:string}>}
 */
module.exports.generateHash = password => {
	console.log("Doing a password hash.");
	const timestamp = Date.now();
	return hash(password, HASH_OPTIONS)
		.then(value => {
			console.log(`Hash took ${Date.now() - timestamp} ms.`);
			hashFile = null;
			return {
				value,
				writePromise: write('hash', value)
			}
		});
};

/**
 * Verify against the password hash.
 * @param {string} password
 * @returns Promise<boolean>
 */
module.exports.verifyPassword = password => {
	hashFile ??= new FileCached('hash');
	return hashFile.read()
		.then(hash => verify(hash, password))
		.then(isValid => {
			if (isValid) hashFile = null;
			return isValid;
		});
};
