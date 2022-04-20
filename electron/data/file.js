const {readFile, writeFile, rm} = require('fs/promises');

/**
 * Returns a simple read-only file getter/setter for the given file path.
 * @param {PathLike} path
 * @constructor
 */
module.exports = path => {

	/**
	 * Current value of file - kept in memory to limit filesystem IOs.
	 * @type ?string
	 */
	let currentValue;

	/**
	 * Get the value from the file. Resolves with NULL if file doesn't exist.
	 * @return Promise<?string>
	 */
	const read = () => {
		console.log(`Reading from ${path}`);
		return readFile(path, 'utf8')
			.catch(() => null);
	}

	/**
	 * Get the current value of the file.
	 * The value is kept in memory after first call to limit filesystem IOs.
	 * Resolves with NULL if file doesn't exist.
	 * @return Promise<?string>
	 */
	const get = () =>
		!!currentValue
			? new Promise(resolve => resolve(currentValue))
			: read().then(data => currentValue = data);

	/**
	 * Delete the file.
	 * @return Promise<void>
	 */
	const del = () => rm(path);

	/**
	 * Write or overwrite the current value to the file.
	 * @return Promise<void>
	 */
	const writeValue = () => {
		console.log(`Writing to ${path}`);
		const write = () => writeFile(path, currentValue, {mode: 0o400});
		return del().then(write, write);
	};

	/**
	 * Set the value and write file.
	 * @param {string} value
	 */
	const set = value => {
		currentValue = value;
		return writeValue();
	};

	/**
	 * Check if the file exists/value is set.
	 * @return Promise<boolean>
	 */
	const isSet = () =>
		get().then(value => !!value);

	return {
		get,
		del,
		set,
		isSet
	};
};
