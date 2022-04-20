const Password = require('./password.js');
const Keys = require('./keys.js');

/**
 * @type boolean
 */
let dataInitialised;

/**
 * Resolves true if user has completed setup process, or false if not.
 * @return Promise<boolean>
 */
module.exports.isInitialised = () =>
	new Promise(resolve => {
		if (!dataInitialised === undefined) resolve(dataInitialised);
		else Password.isSet().then(isSet => {
			if (!isSet) resolve(dataInitialised = isSet);
			else Keys.areGenerated().then(areGenerated =>
				resolve(dataInitialised = areGenerated));
		});
	});

/**
 * Set the master password and generate keys.
 * @param {string} password
 * @return Promise<void>
 */
module.exports.onboard = password =>
	new Promise(resolve => {
		let i = 0;
		function inc() {
			if (++i === 2) {
				resolve();
				console.log("All files written.");
			}
		}
		Password.set(password).then(inc);
		Keys.generate(password).then(data =>
			data.writePromise.then(inc));
	});

/**
 * Test the given password string against the hash.
 * @param {string} password
 * @return Promise<boolean>
 */
module.exports.testPassword = Password.test;
