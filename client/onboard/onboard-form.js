import {createElement} from '../lib/ui/index.js';
import {FormHelper, InputContainer} from '../lib/components/form.js';
import testPasswordStrength from '../lib/data/test-password.js';

const formFunctions = FormHelper();

/**
 * Create a password input element.
 * @param {string} id
 * @param {boolean} [autofocus]
 * @returns HTMLInputElement
 */
const createInput = (id, autofocus = false) => createElement('input', {
	required: true,
	type: 'password',
	autofocus,
	id
}, input => formFunctions.addInput(input));

/**
 * Inputs.
 * @type HTMLInputElement
 */
const passwordInput = createInput('password-input', true),
	confirmInput = createInput('confirm-input');

/**
 * Submit button.
 * @type HTMLInputElement
 */
const submit = createElement('input', {
	id: 'setup-submit',
	type: 'submit'
}, submit => formFunctions.addInput(submit));

/**
 * Error message.
 * @type HTMLParagraphElement
 */
const errorMsg = createElement('p', {
	innerHTML: "&nbsp"
});

/**
 * Display an error message.
 * @param {string} message
 */
const setError = message => {
	errorMsg.innerText = message;
	submit.value = "Submit";
	formFunctions.disable(false);
};

export default createElement('form', {

	/**
	 * Handle form submit event.
	 * @param {SubmitEvent} event
	 */
	onsubmit: event => {

		// Prevent synchronous submit
		event.preventDefault();

		// Temporarily disable form
		formFunctions.disable();
		submit.value = "...";
		errorMsg.innerHTML = "&nbsp";

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
	InputContainer(passwordInput, "Password"),
	InputContainer(confirmInput, "Confirm"),

	// Submit button
	submit,

	// Error message
	createElement('div', {}, errorContainer => {
		errorContainer.classList.add('error');
		errorContainer.append(errorMsg);
	})
));
