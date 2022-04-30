import {createElement} from '../../lib/ui/index.js';

import viewStack from './view.js';
import accountEditor from './account-editor.js';

/**
 * @param {Object} accountData
 * @returns HTMLDivElement
 */
export default accountData => createElement('div', {
	onclick: () => viewStack.push(accountEditor(accountData))
}, element => {

	element.classList.add('account-list-entry');

	element.appendChild(createElement('p', {
		innerText: accountData.service
	}, service => service.classList.add('service')));

	if (accountData.email) element.appendChild(createElement('p', {
		innerText: accountData.email
	}, service => service.classList.add('email')));
});
