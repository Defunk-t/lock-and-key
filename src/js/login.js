import Singleton from "./patterns/singleton.js";

/**
 * Login form API.
 */
export default Singleton(functions => {

	/**
	 * Login form overlay-container.
	 * @type {HTMLDivElement}
	 */
	const container = document.createElement("div");
	container.classList.add("overlay-container");
	container.innerHTML =
		'<form id="login-form" class="login-form">' +
			'<label for="login-input">Password</label>' +
			'<input required autofocus id="login-input" name="password" type="password" placeholder="Master Password">' +
			'<input id="login-submit" class="default" type="submit" value="Unlock">' +
		'</form>';

	/**
	 * Login form submit button.
	 * @type {HTMLInputElement}
	 */
	const button = container.querySelector("#login-submit");
	const input = container.querySelector("#login-input");

	/**
	 * Authenticate the login form.
	 */
	function authenticate() {
		input.disabled = button.disabled = true;
		button.classList.replace("default", "loading");
		button.value = "...";
		setTimeout(authFail, 2500);
	}

	/**
	 * Authentication failed callback.
	 */
	function authFail() {
		input.disabled = button.disabled = false;
		button.classList.replace("loading", "default");
		button.value = "Unlock";
		input.value = "";
	}

	/**
	 * Authentication success callback.
	 */
	function authSuccess() {
		functions.hide();
	}

	/**
	 * Login form onSubmit event handler.
	 * @param {SubmitEvent} event
	 */
	container.querySelector("#login-form").onsubmit = event => {
		event.preventDefault();
		authenticate();
	};

	return container;

});
