import {createElement} from '../../lib/ui/index.js';
import viewStack from './view.js';

/**
 * The back button component will pop the view stack, returning to the previous view.
 * @param {string} [innerText] Can be specified to change the text displayed on the button.
 * @returns HTMLButtonElement
 */
export default (innerText = "Back") => createElement('button', {
	type: 'button',
	innerText,
	onclick: () => viewStack.pop()
}, button => button.classList.add('back'));
