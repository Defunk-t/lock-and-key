import Singleton from "./patterns/singleton.js";

/**
 * Login form API.
 */
export default Singleton(() => {

	/**
	 * Login form overlay-container.
	 * @type {HTMLDivElement}
	 */
	const container = document.createElement("div");
	container.classList.add("overlay-container");
	container.innerHTML =
		'<form id="login-form" class="login-form">' +
		'<label for="login-input">Password</label>' +
		'<input id="login-input" type="password" placeholder="Master Password">' +
		'<input id="login-submit" class="default" type="submit" value="Login">' +
		'</form>';

	/**
	 * Login form submit button.
	 * @type {HTMLInputElement}
	 */
	const button = container.querySelector("#login-submit");
	const input = container.querySelector("#login-input");

	/**
	 * Login form onSubmit event handler.
	 * @param {SubmitEvent} event
	 */
	container.querySelector("#login-form").onsubmit = event => {
		event.preventDefault();
		button.classList.replace("default", "loading");
		button.value = "...";
		console.log("Submitted.");
		setTimeout(() => {
			button.classList.replace("loading", "default");
			button.value = "Login";
			input.value = "";
		}, 3000);
	};

	return container;
});
