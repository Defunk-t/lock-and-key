import {createElement} from '../lib/ui/index.js';
import onboardForm from './onboard-form.js';

document.body.append(createElement('section', {
	id: 'onboard-form'
}, container => {
	container.classList.add('form-container');
	container.append(

		// Introductory text
		createElement('h1', {
			innerText: "Welcome"
		}),
		createElement('p', {
			innerText: "To begin, please choose a secure master password. This password will be used to unlock the app."
		}),

		// Form
		onboardForm
	);
}));
