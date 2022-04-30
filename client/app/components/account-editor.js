import {addAccount, deleteAccount} from '../../lib/data/index.js';
import {createElement} from '../../lib/ui/index.js';
import {FormHelper, InputContainer} from '../../lib/components/form.js';

import viewStack from './view.js';
import backButton from './button-back.js';

export default (accountData = {}) => createElement('section', {
	id: 'account-editor-container'
}, container => {

	const formFunctions = FormHelper();

	container.classList.add('form-container');

	container.append(
		backButton("Cancel"),
		createElement('h1', {
			innerText: `${accountData.id ? "Edit" : "Add"} Account`
		}),
		createElement('form', {
			onsubmit: event => {
				event.preventDefault();
				formFunctions.disable();
				for (const input of event.target)
					if (input.type !== 'submit' && input.value.trim() !== "")
						accountData[input.name] = input.value;
				addAccount(accountData)
					.then(() => viewStack.pop());
			}
		}, form => form.append(
			InputContainer(createElement('input', {
				required: true,
				type: 'text',
				name: 'service',
				value: accountData.service ?? ''
			}, input => formFunctions.addInput(input)), "Service"),
			InputContainer(createElement('input', {
				type: 'email',
				name: 'email',
				value: accountData.email ?? ''
			}, input => formFunctions.addInput(input)), "Email address"),
			createElement('input', {
				type: 'submit'
			})
		))
	);

	if (accountData.id) container.appendChild(createElement('button', {
		type: 'button',
		innerText: 'Delete',
		onclick: () => {
			formFunctions.disable();
			deleteAccount(accountData.id).then(viewStack.pop);
		}
	}, deleteButton => deleteButton.classList.add('delete')));
});
