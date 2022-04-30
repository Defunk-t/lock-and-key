import {PrivateKey, PublicKey, readKey, decrypt, encrypt, decryptKey, readPrivateKey, createMessage, readMessage} from '../../../node_modules/openpgp/dist/openpgp.min.mjs';
import EventHandler from '../event.js';

import testPassword from './test-password.js';
import generateID from './generate-id.js';

const UNLOCK_EVENT = EventHandler();

/**
 * @property {function(password:string):Promise<boolean>} testPassword
 * Verify the password against the password hash.
 * @property {function(fileName:DataFileName):Promise<string|null>} readFile
 * Get a file from the main process over IPC.
 * @property {function(fileName:DataFileName,payload:string):Promise<void>} writeFile
 * Send a payload over IPC to overwrite a file with.
 */
const API = window.API;

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
					UNLOCK_EVENT.fire().clearFunctions();
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
	let id;
	while (!id || accountIndex[id])
		id = generateID();
	accountIndex[id] = data;
	return writeAccountIndex();
};

export const onUnlock = UNLOCK_EVENT.registerFunction;

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
