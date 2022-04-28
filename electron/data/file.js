const {readFile, writeFile, rm} = require('fs/promises');

/**
 * @typedef DataFile
 * @property {function: Promise<string|null>} get Get the current data value.
 * @property {function: Promise<void>} del Remove the file from the disk.
 * @property {function(payload:string): Promise<void>} set Overwrite the file with the payload.
 * @property {function: Promise<boolean>} isSet Check if data/file exists.
 */

/**
 * Returns an interface for managing a data file.
 * @param {string} path
 * @returns DataFile
 * @constructor
 */
const File = path => {

	const get = () => {
		console.log(`Reading from ${path}`);
		return readFile(path, 'utf8')
			.catch(() => null);
	};

	const del = () => rm(path);

	return {

		set: data => {
			console.log(`Writing to ${path}`);
			const write = () => writeFile(path, data, {mode: 0o400});
			return del().then(write, write);
		},

		isSet: () =>
			get().then(value => !!value),

		get,
		del
	};
};

/**
 * Returns an interface for managing a data file.
 * File's current value is kept in memory.
 * @param {string} path
 * @returns DataFile
 * @constructor
 */
const FileCached = path => {

	const file = File(path);

	const {get, set} = file;

	/**
	 * Current value of file - kept in memory to limit filesystem IOs.
	 * @type string|null
	 */
	let currentValue;

	const newGet = () => !!currentValue
		? new Promise(resolve => resolve(currentValue))
		: get().then(data => currentValue = data);

	file.get = newGet;

	file.set = data =>
		set(currentValue = data);

	file.isSet = () =>
		newGet().then(value => !!value);

	return file;
};

module.exports = {
	File,
	FileCached
};
