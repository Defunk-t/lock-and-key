const {join} = require('path');
const {mkdirSync} = require('fs');
const {access, readFile, writeFile, rm} = require('fs/promises');

const {app} = require('electron');

const DATA_DIR = join(app.getPath('home'), '.lock-and-key');
const SECRETS_DIR = require('path').join(DATA_DIR, 'secrets');

mkdirSync(SECRETS_DIR, {recursive: true, mode: 0o700});

/**
 * @typedef {'hash'|'privateKey'|'publicKey'|'accountIndex'|string} DataFileName
 */

/**
 * Convert the `DataFileName` to its actual full path.
 * @param {DataFileName} fileName
 * @returns string
 */
const getPath = fileName => {
	switch (fileName) {
		case 'privateKey':
			return join(DATA_DIR, 'id_ecdsa');
		case 'publicKey':
			return join(DATA_DIR, 'id_ecdsa.pub');
		case 'accountIndex':
			return join(DATA_DIR, 'index');
		case 'hash':
			return join(DATA_DIR, fileName);
	}
	return join(SECRETS_DIR, fileName);
}

/**
 * Read the contents of the file. Returns a promise that fulfills with a `string`
 * containing the file contents, or `NULL` if the file doesn't exist or if an error occurs.
 * @param {string} path
 * @returns Promise<string|null>
 */
const read = path => {
	console.log(`Reading from ${path}`);
	return readFile(path, 'utf8').catch(() => null);
};

/**
 * Delete the file.
 * @param {string} path
 * @returns Promise<void>
 */
const del = path => rm(path);

/**
 * Overwrite the file with the payload.
 * @param {string} path
 * @param {string} payload
 * @returns Promise<void>
 */
const write = (path, payload) => {
	console.log(`Writing to ${path}`);
	const write = () => writeFile(path, payload, {mode: 0o400});
	return del(path).then(write, write);
};

/**
 * Check if the file exists and has content. Returns a promise that fulfills with a boolean.
 * @param {string} path
 * @returns Promise<boolean>
 */
const exists = path => access(path).then(() => true, () => {
	console.log(`Not found: ${path}`);
	return false;
});

/**
 * Convenience class that remembers the filename for file operations.
 */
class File {

	/**
	 * @param {DataFileName} fileName
	 */
	constructor(fileName) {
		this._path = getPath(fileName);
	}

	get path() {
		return this._path
	}

	/**
	 * Read the contents of the file. Returns a promise that fulfills with a `string`
	 * containing the file contents, or `NULL` if the file doesn't exist or if an error occurs.
	 * @returns Promise<string|null>
	 */
	read = () => read(this._path)

	/**
	 * Delete the file.
	 * @returns Promise<void>
	 */
	del = () => del(this._path)

	/**
	 * Overwrite the file with the payload.
	 * @param {string} payload
	 * @returns Promise<void>
	 */
	write = payload => write(this._path, payload)

	/**
	 * Check if the file exists and has content. Returns a promise that fulfills with a boolean.
	 * @returns Promise<boolean>
	 */
	exists = () => exists(this._path)
}

/**
 * Extends `File` by keeping the contents of the file in memory to reduce filesystem IO.
 */
class FileCached extends File {

	_currentValue;

	/**
	 * Read the contents of the file. Returns a promise that fulfills with a `string`
	 * containing the file contents, or `NULL` if the file doesn't exist or if an error occurs.
	 * @returns Promise<string|null>
	 */
	read = () => this._currentValue
		? new Promise(resolve => resolve(this._currentValue))
		: read(this._path).then(contents => this._currentValue = contents)

	/**
	 * Overwrite the file with the payload.
	 * @param {string} payload
	 * @returns Promise<void>
	 */
	write = payload => {
		this._currentValue = payload;
		return write(this._path, payload);
	}

	/**
	 * Check if the file exists and has content. Returns a promise that fulfills with a boolean.
	 * @returns Promise<boolean>
	 */
	exists = () => this.read().then(contents => !!contents)
}

module.exports = {

	/**
	 * Read the contents of the file. Returns a promise that fulfills with a `string`
	 * containing the file contents, or `NULL` if the file doesn't exist or if an error occurs.
	 * @param {DataFileName} fileName
	 * @returns Promise<string|null>
	 */
	read: fileName => read(getPath(fileName)),

	/**
	 * Delete the file.
	 * @param {DataFileName} fileName
	 * @returns Promise<void>
	 */
	del: fileName => del(getPath(fileName)),

	/**
	 * Overwrite the file with the payload.
	 * @param {DataFileName} fileName
	 * @param {string} payload
	 * @returns Promise<void>
	 */
	write: (fileName, payload) => write(getPath(fileName), payload),

	/**
	 * Check if the file exists and has content. Returns a promise that fulfills with a boolean.
	 * @param {DataFileName} fileName
	 * @returns Promise<boolean>
	 */
	exists: fileName => exists(getPath(fileName)),

	File,
	FileCached
};
