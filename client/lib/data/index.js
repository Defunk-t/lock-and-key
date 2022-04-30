import {PrivateKey, PublicKey, readKey, decrypt, encrypt, decryptKey, readPrivateKey, createMessage, readMessage} from '../../../node_modules/openpgp/dist/openpgp.min.mjs';
import EventHandler from '../event.js';

import testPassword from './test-password.js';
import generateID from './generate-id.js';

/**
 * @property {function(password:string):Promise<boolean>} testPassword
 * Verify the password against the password hash.
 * @property {function(fileName:DataFileName):Promise<string|null>} readFile
 * Get a file from the main process over IPC.
 * @property {function(fileName:DataFileName,payload:string):Promise<void>} writeFile
 * Send a payload over IPC to overwrite a file with.
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

/**
 * Retrieve the account index.
 * @returns Promise<Object>
 */
export const getAccountIndex = () => accountIndex
	? new Promise(resolve => resolve(accountIndex))
	: API.readFile('accountIndex')
		.then(armoredMessage => readMessage({
			armoredMessage
		}))
		.then(message => decrypt({
			message,
			decryptionKeys: privateKey
		}))
		.then(data => accountIndex = JSON.parse(data.data))
		.catch(() => accountIndex = {});

/**
 * Overwrite the account index.
 * @returns Promise<void>
 */
const writeAccountIndex = () =>
	getAccountIndex()
		.then(data => createMessage({text: JSON.stringify(data)}))
		.then(message => encrypt({
			message,
			encryptionKeys: publicKey
		}))
		.then(payload => API.writeFile('accountIndex', payload));

export const addAccount = data => {

	const id = data.id ?? (() => {
		let id;
		while (!id || accountIndex[id])
			id = generateID();
		return id;
	})();

	delete data.id;
	accountIndex[id] = data;

	EVENT_ACCOUNT_UPDATE.fire(fn => fn({
		id,
		...data
	}));

	return writeAccountIndex();
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
 * @param {function(Object)} fn
 */
export const onAccountChange = (...fn) => {
	EVENT_ACCOUNT_UPDATE.registerFunction(...fn);
};

export {
	testPassword
};

export default {
	testPassword,
	unlock,
	onUnlock,
	getAccountIndex,
	addAccount
};
