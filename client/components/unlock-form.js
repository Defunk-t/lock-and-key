import {createElement, Singleton} from "../lib/ui/index.js";
import Auth from "../lib/auth.js";

/**
 * Login form API.
 */
export default Singleton(functions => createElement('div', {}, container => {

	/**
	 * The password input box.
	 * @type HTMLInputElement
	 */
	const input = createElement('input', {
		required: true,
		autofocus: true,
		id: 'login-input',
		name: 'password',
		type: 'password',
		placeholder: "Master Password"
		//oninvalid: event => { // TODO
		//	event.preventDefault();
		//}
	});

	/**
	 * The form submit button.
	 * @type HTMLInputElement
	 */
	const submit = createElement('input', {
		id: 'login-submit',
		type: 'submit',
		value: "Unlock"
	});

	/**
	 * Authentication succeeded callback.
	 */
	const authSuccess = () => { // TODO
		functions.destroy();
	};

	/**
	 * Authentication failed callback.
	 * @return void
	 */
	const authFail = () => {
		input.disabled = submit.disabled = false;
		submit.value = "Unlock";
		input.value = "";
		input.focus();
	};

	/**
	 * Authenticate the login form.
	 * @param {Event} [event]
	 * @return void
	 */
	const authenticate = event => {
		if (event) event.preventDefault();
		input.disabled = submit.disabled = true;
		submit.value = "...";
		setTimeout(Auth.unlock(input.value) ? authSuccess : authFail, 2000);
	};

	// Set up the Singleton
	container.classList.add('overlay-container');
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
				id: 'login-form',
				onsubmit: authenticate
			},
			// Append elements to the form
			form => form.append(

				// Password label + input
				createElement('label', {
					for: 'login-input',
					innerText: "Password"
				}),
				input,

				// Submit button
				submit
			)
		)
	);
}));
