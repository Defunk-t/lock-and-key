// TODO: a more advanced version of this could return `PasswordTest` object which contains a property with a boolean
// 		value (pass or fail) for various checks (length, use of numbers and symbols, dictionary checks).

/**
 * Decides whether a password is strong enough.
 * Returns an error message `string` if the password is not strong enough,
 * otherwise returns `null`.
 * @param {string} password
 * @return string|null
 */
export const testPassword = password =>
	password.length < 8 ? "Password should be a minimum of 8 characters." : null;

export default testPassword;
