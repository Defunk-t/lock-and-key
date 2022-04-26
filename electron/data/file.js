const {readFile, writeFile, rm} = require('fs/promises');

const File = path => {

	/**
	 * Read the file contents. Returns a promise that resolves with the files contents in a string if it exists,
	 * otherwise resolves `NULL`.
	 * @return Promise<?string>
	 */
	const get = () => {
		console.log(`Reading from ${path}`);
		return readFile(path, 'utf8')
			.catch(() => null);
	};

	/**
	 * Deletes the file.
	 * @return Promise<void>
	 */
	const del = () => rm(path);

	return {

		/**
		 * Overwrite the file with the given data payload.
		 * @param {string} data
		 * @return Promise<void>
		 */
		set: data => {
			console.log(`Writing to ${path}`);
			const write = () => writeFile(path, data, {mode: 0o400});
			return del().then(write, write);
		},

		/**
		 * Check if this file or data exists.
		 * @return Promise<boolean>
		 */
		isSet: () =>
			get().then(value => !!value),

		get,
		del
	};
};

const FileCached = path => {

	const file = File(path);

	const {get, set} = file;

	/**
	 * Current value of file - kept in memory to limit filesystem IOs.
	 * @type ?string
	 */
	let currentValue;

	/**
	 * Read the file contents or cached value. Returns a promise that resolves with the files contents in a string
	 * if it exists, otherwise resolves `NULL`. Value is kept in memory after first call to reduce filesystem IOs.
	 * @return Promise<?string>
	 */
	file.get = () => !!currentValue
		? new Promise(resolve => resolve(currentValue))
		: get().then(data => currentValue = data);

	/**
	 * Overwrite the file with the given data payload.
	 * @param {string} data
	 * @return Promise<void>
	 */
	file.set = data =>
		set(currentValue = data);

	/**
	 * Check if this file or data exists.
	 * @return Promise<boolean>
	 */
	file.isSet = () =>
		get().then(value => !!value);

	return file;
};

module.exports = {
	File,
	FileCached
};
