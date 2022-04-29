import {createElement} from '../../lib/ui/index.js';
import {getAccountIndex} from '../../lib/data.js';
import {appendFunction} from '../../lib/events.js';

import accountEntry from './account-list-entry.js';

const accountList = createElement('div', {
	id: 'account-list'
});

export default createElement('section', {
	id: 'account-list-container'
}, container => container.append(
	createElement('h1', {
		innerText: "Accounts"
	}),
	createElement('div', {
		innerText: "New"
	}, newButton => newButton.classList.add('button', 'new')),
	accountList
));

appendFunction('unlock', reload);

function reload() {
	return getAccountIndex()
		.then(accountIndex => {

			// Clear the container
			while (accountList.lastChild)
				accountList.lastChild.remove();

			// Create entries
			Object.getOwnPropertyNames(accountIndex)
				.forEach(property => accountList.append(accountEntry(accountIndex[property])));
		});
}
