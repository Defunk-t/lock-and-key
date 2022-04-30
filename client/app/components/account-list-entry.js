import {createElement} from '../../lib/ui/index.js';

/**
 * @param {Object} accountData
 * @returns HTMLDivElement
 */
export default accountData => createElement('div', {
	innerText: parseName(accountData)
}, element => element.classList.add('account-list-entry'));

function parseName(accountData) {
	switch (typeof accountData) {
		case 'string':
			return accountData;
		case 'object':
			return accountData.service;
		default:
			throw new TypeError();
	}
}
