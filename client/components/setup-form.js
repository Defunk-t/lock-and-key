import {createElement, Singleton} from "../lib/ui/index.js";

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
			id: 'setup-form'
			//onsubmit:
		},
		form => form.append(

			// Password label + input
			createElement('label', {
				for: 'submit-pw-input',
				innerText: "Choose a master password"
			}),
			pwInput,

			// Confirm password label + input
			createElement('label', {
				for: 'submit-confirm-input',
				innerText: "Confirm password"
			}),
			pwConfirmInput,

			// Submit button
			submit
		))
	);
}));
