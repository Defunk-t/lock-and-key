const ID_CHARS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const ID_CHARS_LEN = ID_CHARS.length - 1;

export default () => {
	let id = "";
	for (let i = 0; i < 4; i++)
		id += ID_CHARS.charAt(Math.floor(Math.random() * ID_CHARS_LEN));
	return id;
};
