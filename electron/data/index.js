const {exists} = require('./file.js');
const {generateHash, verifyPassword} = require('./password.js');
const generateKeys = require('./generate-keys.js');

/**
 * Resolves true if user has completed setup process, or false if not.
 * @return Promise<boolean>
 */
const isInitialised = () => new Promise(resolve => {
	let i = 0;
	['hash', 'privateKey', 'publicKey'].forEach(fileName =>
		exists(fileName).then(exists => {
			if (!exists) resolve(false);
			else if (++i === 3) resolve(true);
		})
	);
});

/**
 * Set the master password and generate keys.
 * @param {string} password
 * @return Promise<void>
 */
const onboard = password => new Promise(resolve => {
	let i = 0;
	[generateHash, generateKeys].forEach(fn => fn(password)
		.then(result => result.writePromise)
		.then(() => {
			if (++i === 2) resolve();
		})
	);
});

module.exports = {
	isInitialised,
	onboard,
	verifyPassword
};
