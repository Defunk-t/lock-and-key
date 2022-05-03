const ID_CHARS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const PW_CHARS = ID_CHARS + "abcdefghijklmnopqrstuvwxyz!#$%&'()*+,-./:;<=>?@[]^_`{|}~";
const ID_CHARS_LEN = ID_CHARS.length - 1;
const PW_CHARS_LEN = PW_CHARS.length - 1;

function generate(chars, outputLength, charsLength = chars.length - 1) {
	let output = "";
	for (let i = 0; i < outputLength; i++)
		output += chars.charAt(Math.floor(Math.random() * charsLength));
	return output;
}

export const generateID = () => generate(ID_CHARS, 4, ID_CHARS_LEN);

export const generatePassword = () => generate(PW_CHARS, 16, PW_CHARS_LEN);

export default {
	generateID,
	generatePassword
};
