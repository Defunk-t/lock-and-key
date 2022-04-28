import {createElement} from '../ui/index.js';

export const FormHelper = () => {

	const inputs = [];

	return {
		disable: (boolean = true) => {
			for (const input of inputs)
				input.disabled = boolean;
		},

		addInput: input =>
			inputs.push(input),
	};
};

export const InputContainer = (input, label) => createElement('div', {}, container => {
	container.classList.add('input-container');
	container.append(
		createElement('label', {
			for: input.id,
			innerText: label
		}),
		input
	);
});

export default {
	FormHelper,
	InputContainer
}
