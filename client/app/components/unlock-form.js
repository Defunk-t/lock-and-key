import {createElement} from '../../lib/ui/index.js';
import {FormHelper, InputContainer} from '../../lib/components/form.js';
import {unlock} from '../../lib/data.js';

const formFunctions = FormHelper();

/**
 * Password input box.
 * @type HTMLInputElement
 */
const input = createElement('input', {
	required: true,
	type: 'password',
	autofocus: true,
	id: 'password-input'
}, input => formFunctions.addInput(input));

/**
 * Submit button.
 * @type HTMLInputElement
 */
const submit = createElement('input', {
	type: 'submit',
	value: "Unlock"
}, submit => formFunctions.addInput(submit));

/**
 * Error message.
 * @type HTMLParagraphElement
 */
const errorMsg = createElement('p', {
	innerHTML: "&nbsp"
});

/**
 * Authentication failed callback
 * @returns void
 */
const setError = message => {
	errorMsg.innerText = message;
	input.value = "";
	submit.value = "Unlock";
	formFunctions.disable(false);
	input.focus();
};

export default createElement('section', {
	id: 'unlock-form'
}, container => {
	container.classList.add('form-container');
	container.append(

		// Introductory text
		createElement('h1', {
			innerText: "Welcome"
		}),
		createElement('p', {
			innerText: "Enter your master password to unlock the app."
		}),

		// Form
		createElement('form',
			{
				onsubmit: event => {
					event.preventDefault();
					formFunctions.disable();
					submit.value = "...";
					errorMsg.innerHTML = "&nbsp";
					unlock(input.value)
						.then(pwValid => pwValid
							? container.remove()
							: setError("Incorrect password."))
						.catch(setError);
				}
			},

			// Append elements to the form
			form => form.append(
				InputContainer(input, "Password"),
				submit
			)
		),

		createElement('div', {}, errorContainer => {
			errorContainer.classList.add('error');
			errorContainer.append(errorMsg);
		})
	);
});
