import {createElement, Singleton} from '../lib/ui/index.js';
import {setKey} from '../lib/data.js';

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
	 * Authentication failed callback.
	 * @return void
	 */
	const setError = () => {
		input.disabled = submit.disabled = false;
		submit.value = "Unlock";
		input.value = "";
		input.focus();
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
				onsubmit: event => {
					event.preventDefault();
					input.disabled = submit.disabled = true;
					submit.value = "...";
					window.API.unlock(input.value)
						.then(key => {
							if (key) {
								setKey(key);
								functions.destroy();
							}
							else setError();
						}, setError);
				}
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
