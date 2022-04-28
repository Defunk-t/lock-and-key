import {PrivateKey, PublicKey, readKey, decrypt, encrypt, decryptKey, readPrivateKey, createMessage, readMessage} from '../../node_modules/openpgp/dist/openpgp.min.mjs';
import {fire} from './events.js';

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
	window.API.testPassword(passphrase).then(pwValid => {
		if (!pwValid) resolve(false);
		else {

			let i = 0;

			const inc = () => {
				if (++i === 2) {
					resolve(true);
					fire('unlock');
				}
			};

			window.API.privateKey.get()
				.then(armoredKey => readPrivateKey({armoredKey}))
				.then(privateKey => decryptKey({
					privateKey,
					passphrase
				}))
				.then(key => inc(privateKey = key));

			window.API.publicKey.get()
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
	: window.API.accountIndex.get()
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
export const writeAccountIndex = () =>
	getAccountIndex()
		.then(data => createMessage({text: JSON.stringify(data)}))
		.then(message => encrypt({
			message,
			encryptionKeys: publicKey
		}))
		.then(window.API.accountIndex.write);

export default {
	unlock,
	getAccountIndex
};
