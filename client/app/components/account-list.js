import {createElement} from '../../lib/ui/index.js';
import {getAccountIndex, onUnlock} from '../../lib/data/index.js';

import viewStack from './view.js';
import AccountEditor from './account-editor.js';
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
	createElement('button', {
		type: 'button',
		innerText: "New",
		onclick: () => viewStack.push(AccountEditor())
	}, newButton => newButton.classList.add('new')),
	accountList
));

const reload = () => getAccountIndex().then(accountIndex => {

	// Clear the container
	while (accountList.lastChild)
		accountList.lastChild.remove();

	// Create entries
	Object.getOwnPropertyNames(accountIndex)
		.forEach(property => accountList.append(accountEntry(accountIndex[property])));
});

onUnlock(reload);
