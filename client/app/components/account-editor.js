import {setAccountData, deleteAccount, getData, generatePassword} from '../../lib/data/index.js';
import {createElement} from '../../lib/ui/index.js';
import {FormHelper, InputContainer} from '../../lib/components/form.js';

import viewStack from './view.js';
import backButton from './button-back.js';

export default (accountData = {}) => createElement('section', {}, container => {

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
					if (input.type !== 'submit' && input.value.trim() !== "") switch (input.name) {
						case 'service':
						case 'email':
							accountData[input.name] = input.value;
							break;
						default:
							accountData.secrets ??= {};
							accountData.secrets[input.name] = input.value;
							break;
					}
				setAccountData(accountData)
					.then(() => viewStack.pop());
			}
		}, form => {

			const passwordInput = createElement('input', {
				type: 'password',
				name: 'password'
			}, input => formFunctions.addInput(input));

			if (accountData.id) getData(accountData.id)
				.then(accountSecrets => {
					if (accountSecrets.password) passwordInput.value = accountSecrets.password;
				});

			form.append(
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
				InputContainer(passwordInput, "Password"),
				createElement('div', {}, buttonContainer => {
					buttonContainer.classList.add('account-editor-buttons');
					formFunctions.addInput(buttonContainer.appendChild(createElement('input', {
						type: 'submit',
						value: "Save"
					})));
					if (accountData.id) formFunctions.addInput(buttonContainer.appendChild(createElement('button', {
						type: 'button',
						innerText: "Delete",
						onclick: () => {
							formFunctions.disable();
							deleteAccount(accountData.id).then(viewStack.pop);
						}
					}, deleteButton => deleteButton.classList.add('delete'))));
					formFunctions.addInput(buttonContainer.appendChild(createElement('button', {
						type: 'button',
						innerText: "Generate Password",
						onclick: () => {
							formFunctions.disable();
							passwordInput.value = generatePassword();
							formFunctions.disable(false);
						}
					})));
					formFunctions.addInput(buttonContainer.appendChild(createElement('button', {
						type: 'button',
						innerText: "Reveal Password",
						onclick: event => {
							if (passwordInput.type === 'password') {
								passwordInput.type = 'text';
								event.target.innerText = "Hide Password";
							}
							else {
								passwordInput.type = 'password';
								event.target.innerText = "Reveal Password";
							}
						}
					})))
				})
			);
		})
	);
});
