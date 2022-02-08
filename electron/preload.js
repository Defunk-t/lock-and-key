// All Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.

function replaceText(selector, text) {
	const e = document.getElementById(selector);
	if (e) e.innerText = text;
}

window.addEventListener("DOMContentLoaded", () => {

});
