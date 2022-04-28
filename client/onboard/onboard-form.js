import {createElement} from '../lib/ui/index.js';
import testPasswordStrength from '../lib/test-password.js';

/**
 * Form inputs.
 * @type Array<HTMLInputElement>
 */
const inputs = [];

/**
 * Disable or enable all inputs.
 * @param {boolean} boolean
 */
const setInputsDisabled = boolean => {
	for (const input of inputs)
		input.disabled = boolean;
};

/**
 * Create a password input element.
 * @param {string} id
 * @returns HTMLInputElement
 */
const createInput = id => createElement('input', {
	required: true,
	type: 'password',
	id: id,
	name: id
}, input => inputs.push(input));

/**
 * Create a container element for an input with a label.
 * @param {HTMLInputElement} input
 * @param {string} label
 * @returns HTMLDivElement
 */
const createFormInput = (input, label) => createElement('div', {}, container => {
	container.classList.add('input-container');
	container.append(createElement('label', {
		for: input.id,
		innerText: label
	}), input);
});

/**
 * Inputs.
 * @type HTMLInputElement
 */
const passwordInput = createInput('password-input'),
	confirmInput = createInput('confirm-input');

/**
 * Submit button.
 * @type HTMLInputElement
 */
const submit = createElement('input', {
	id: 'setup-submit',
	type: 'submit'
}, submit => inputs.push(submit));

/**
 * Error message.
 * @type HTMLParagraphElement
 */
const errorMsg = createElement('p', {}, element =>
	element.classList.add('error'));

/**
 * Display an error message.
 * @param {string} message
 */
const setError = message => {
	errorMsg.innerText = message;
	submit.value = "Submit";
	setInputsDisabled(false);
};

export default createElement('form', {

	id: 'setup-form',

	/**
	 * Handle form submit event.
	 * @param {SubmitEvent} event
	 */
	onsubmit: event => {

		// Prevent synchronous submit
		event.preventDefault();

		// Temporarily disable form
		setInputsDisabled(true);
		submit.value = "...";
		errorMsg.innerText = "";

		// Check if passwords match
		if (passwordInput.value !== confirmInput.value)
			return setError("Passwords do not match.");

		// Test password strength then start onboard process
		const error = testPasswordStrength(passwordInput.value);
		if (error) setError(error);
		else window.API.onboard(passwordInput.value)
			.catch(setError);
	}
},
form => form.append(

	// Inputs
	createFormInput(passwordInput, "Password"),
	createFormInput(confirmInput, "Confirm"),

	// Submit button
	submit,

	// Error message
	errorMsg
));
