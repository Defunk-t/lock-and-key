import {createElement} from '../../lib/ui/index.js';

import accountList from './account-list.js';

export default createElement('div', {
	id: 'app-content'
}, container => container.append(
	createElement('h1', {
		innerText: "Accounts"
	}),
	accountList
));
