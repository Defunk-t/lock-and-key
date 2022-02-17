import Singleton from "../../patterns/singleton";
import {cE} from "../../patterns/common";

import "./style.css";

/**
 * Login form API.
 */
export default Singleton(functions => cE('div', {}, container => {

	/**
	 * The password input box.
	 * @type HTMLInputElement
	 */
	const input = cE('input', {
		required: true,
		autofocus: true,
		id: "login-input",
		name: "password",
		type: "password",
		placeholder: "Master Password",
		oninvalid: event => { // TODO
			//event.preventDefault();
			console.log("Invalid event caught");
		}
	});

	/**
	 * The form submit button.
	 * @type HTMLInputElement
	 */
	const submit = cE('input', {
		id: "login-submit",
		type: "submit",
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
		// TODO: authenticate
		setTimeout(authFail, 2500);
	};

	container.classList.add("overlay-container");
	container.append(cE('form',
		{
			id: "login-form",
			onsubmit: authenticate
		},
		form => form.append(
			cE('label', {
				for: "login-input",
				innerText: "Password"
			}),
			input,
			submit
		)
	));
}));
