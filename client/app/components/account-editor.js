import {addAccount} from '../../lib/data.js';
import {createElement} from '../../lib/ui/index.js';
import {FormHelper, InputContainer} from '../../lib/components/form.js';

import viewStack from './view.js';
import backButton from './button-back.js';

export default () => createElement('section', {
	id: 'account-editor-container'
}, container => {

	const formFunctions = FormHelper();

	container.classList.add('form-container');

	container.append(
		backButton("Cancel"),
		createElement('h1', {
			innerText: "Add Account"
		}),
		createElement('form', {
			onsubmit: event => {
				event.preventDefault();
				formFunctions.disable();
				const data = {};
				for (const input of event.target)
					if (input.type !== 'submit')
						data[input.name] = input.value;
				addAccount(data)
					.then(() => viewStack.pop());
			}
		}, form => form.append(
			InputContainer(createElement('input', {
				required: true,
				type: 'text',
				name: 'service'
			}, input => formFunctions.addInput(input)), "Service"),
			InputContainer(createElement('input', {
				type: 'text',
				name: 'email'
			}, input => formFunctions.addInput(input)), "Email address"),
			createElement('input', {
				type: 'submit'
			})
		))
	);
});
