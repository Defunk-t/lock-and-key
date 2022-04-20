import {createElement, Singleton} from "../lib/ui/index.js";
import testPassword from "../lib/test-password.js";

export default Singleton(functions => createElement('div', {}, container => {

	/**
	 * The password input box.
	 * @type HTMLInputElement
	 */
	const pwInput = createElement('input', {
		required: true,
		id: 'setup-pw-input',
		name: 'password',
		type: 'password',
		placeholder: "Master Password"
		//oninvalid: event => { // TODO
		//	event.preventDefault();
		//}
	});

	/**
	 * The password confirmation input. Content must match `pwInput`.
	 * @type HTMLInputElement
	 */
	const pwConfirmInput = createElement('input', {
		required: true,
		id: 'setup-confirm-input',
		name: 'confirm',
		type: 'password',
		placeholder: "Confirm Password"
		//oninvalid: event => { // TODO
		//	event.preventDefault();
		//}
	});

	/**
	 * The form submit button.
	 * @type HTMLInputElement
	 */
	const submit = createElement('input', {
		id: 'setup-submit',
		type: 'submit'
	});

	/**
	 * The form error message.
	 * @type HTMLParagraphElement
	 */
	const errorMsg = createElement('p', {}, element =>
		element.classList.add('error'));

	/**
	 *
	 * @param {string} message
	 */
	const setError = message => {
		errorMsg.innerText = message;
		pwConfirmInput.value = "";
		pwInput.disabled = pwConfirmInput.disabled = submit.disabled = false;
		submit.value = "Submit";
		pwInput.focus();
	};

	// Set up the Singleton
	container.classList.add('overlay-container');
	container.append(

		// Introductory text
		createElement('h1', {
			innerText: "Welcome"
		}),
		createElement('p', {
			innerText: "To begin, please choose a secure master password."
		}),
		createElement('p', {
			innerText: "This password will be used to unlock the app."
		}),

		// Form
		createElement('form', {
			id: 'setup-form',

			/**
			 * Handle form submit event.
			 * @param {SubmitEvent} event
			 */
			onsubmit: event => {

				// Prevent synchronous submit
				event.preventDefault();

				// Temporarily disable form
				pwInput.disabled = pwConfirmInput.disabled = submit.disabled = true;
				submit.value = "...";

				// Check if passwords match
				if (pwInput.value !== pwConfirmInput.value) return setError("Passwords do not match.");

				// Test password strength
				const error = testPassword(pwInput.value);
				if (error) return setError(error);

				// Start onboard process
				window.API.onboard(pwInput.value)
					.then(() => errorMsg.innerText = "Success!", setError);
			}
		},
		form => form.append(

			// Password label
			createElement('label', {
				for: 'submit-pw-input',
				innerText: "Choose a master password"
			}),

			// Password input
			pwInput,

			// Confirm password label
			createElement('label', {
				for: 'submit-confirm-input',
				innerText: "Confirm password"
			}),

			// Confirm password input
			pwConfirmInput,

			// Submit button
			submit,

			// Error message
			errorMsg
		))
	);
}));
