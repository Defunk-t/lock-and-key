import {PrivateKey, PublicKey, readKey, decrypt, encrypt, decryptKey, readPrivateKey, createMessage, readMessage} from '../../../node_modules/openpgp/dist/openpgp.min.mjs';
import EventHandler from '../event.js';

import testPassword from './test-password.js';
import {generateID, generatePassword} from './generate-id.js';

/**
 * @property {function(password:string):Promise<boolean>} testPassword
 * Verify the password against the password hash.
 * @property {function(fileName:DataFileName):Promise<string|null>} readFile
 * Get a file from the main process over IPC.
 * @property {function(fileName:DataFileName,payload:string):Promise<void>} writeFile
 * Send a payload over IPC to overwrite a file with.
 * @property {function(filename:DataFileName):Promise<void>} deleteFile
 * Delete the file.
 */
const API = window.API;

const EVENT_UNLOCK = EventHandler();
const EVENT_ACCOUNT_UPDATE = EventHandler();

let unlocked = false;

/**
 * @type Object
 */
let accountIndex;

/**
 * @type PrivateKey
 */
let privateKey;

/**
 * @type PublicKey
 */
let publicKey;

/**
 * Set the private key and derive the public key.
 * @param {string} passphrase
 * @returns Promise<boolean>
 */
export const unlock = passphrase => new Promise(resolve =>
	API.testPassword(passphrase).then(pwValid => {
		if (!pwValid) resolve(false);
		else {

			let i = 0;

			const inc = () => {
				if (++i === 2) {
					resolve(true);
					unlocked = true;
					EVENT_UNLOCK.fire().clearFunctions();
				}
			};

			API.readFile('privateKey')
				.then(armoredKey => readPrivateKey({armoredKey}))
				.then(privateKey => decryptKey({
					privateKey,
					passphrase
				}))
				.then(key => inc(privateKey = key));

			API.readFile('publicKey')
				.then(armoredKey => readKey({armoredKey}))
				.then(key => inc(publicKey = key));
		}
	})
);

const assertFileName = fileName => {
	switch (fileName) {
		case '':
			throw TypeError("Empty file name given.");
		case 'privateKey':
		case 'publicKey':
		case 'hash':
			throw TypeError(`'${fileName}' not accessible via this function.`);
	}
};

/**
 * @typedef {'accountIndex'|string} EncryptedJSONFileName
 */

/**
 * Retrieve data, decrypt, and parse JSON.
 * @param {EncryptedJSONFileName} fileName
 * @returns Promise<Object>
 */
export const getData = fileName => {
	assertFileName(fileName);
	return API.readFile(fileName)
		.then(armoredMessage => readMessage({
			armoredMessage
		}))
		.then(message => decrypt({
			message,
			decryptionKeys: privateKey
		}))
		.then(data => JSON.parse(data.data))
		.catch(() => {
			return {};
		});
}

/**
 * Promise fulfills with the account index object.
 * @returns Promise<Object>
 */
export const getAccountIndex = () => accountIndex
	? new Promise(resolve => resolve(accountIndex))
	: getData('accountIndex')
		.then(data => {
			console.log(data);
			return accountIndex = data;
		});

/**
 * Stringify, encrypt, and write data.
 * @param {EncryptedJSONFileName} fileName
 * @param {Object} payload
 * @returns PromiseLike<void>
 */
export const writeData = (fileName, payload) => {
	assertFileName(fileName);
	return createMessage({text: JSON.stringify(payload)})
		.then(message => encrypt({
			message,
			encryptionKeys: publicKey
		}))
		.then(payload => API.writeFile(fileName, payload));
};

/**
 * Overwrite the account index.
 * @returns Promise<void>
 */
const writeAccountIndex = () => getAccountIndex()
	.then(data => writeData('accountIndex', data));

/**
 * @typedef AccountData
 * @property {string} service
 * @property {string} [id]
 * @property {string} [email]
 * @property {AccountSecrets} [secrets]
 */

/**
 * @typedef AccountSecrets
 * @property {string} [password]
 */

/**
 * Add or change account data.
 * @param {AccountData} data
 * @returns Promise<void>
 */
export const setAccountData = data => new Promise(resolve => {

	const id = data.id ?? (() => {
		let id;
		while (!id || accountIndex[id])
			id = generateID();
		return id;
	})();

	let i = 0;
	const inc = () => {
		if (++i === 2) {
			EVENT_ACCOUNT_UPDATE.fire();
			resolve();
		}
	};

	if (data.secrets) {
		writeData(id, data.secrets).then(inc);
		delete data.secrets;
	} else API.deleteFile(id).then(inc);

	delete data.id;
	accountIndex[id] = data;
	writeAccountIndex().then(inc);
});

/**
 * Delete the account.
 * @param {string} id
 * @returns Promise<void>
 */
export const deleteAccount = id => {
	delete accountIndex[id];
	EVENT_ACCOUNT_UPDATE.fire();
	return new Promise(resolve => {
		let i = 0;
		const inc = () => {
			if (++i === 2) resolve();
		};
		writeAccountIndex().then(inc);
		API.deleteFile(id).then(inc);
	});
};

/**
 * Invoke callback(s) once app is unlocked.
 * (or immediately if it has already occurred.)
 * @param {function} fn
 */
export const onUnlock = (...fn) => {
	if (unlocked) fn.forEach(fn => fn());
	else EVENT_UNLOCK.registerFunction(...fn);
};

/**
 * Invoke callback(s) when an account is created/modified.
 * The account data will be passed in.
 * @param {function} fn
 */
export const onAccountChange = (...fn) => {
	EVENT_ACCOUNT_UPDATE.registerFunction(...fn);
};

export {
	testPassword,
	generatePassword
};

export default {
	testPassword,
	generatePassword,
	unlock,
	getData,
	writeData,
	getAccountIndex,
	setAccountData,
	deleteAccount,
	onUnlock,
	onAccountChange
};
