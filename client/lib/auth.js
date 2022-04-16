/**
 * Decides whether a password is strong enough.
 * Returns an error message `string` if the password is not strong enough,
 * otherwise returns `false`.
 * @param {string} password
 * @return string|null
 */
export const testPassword = password =>
	password.length < 8 ? "Password should be a minimum of 8 characters." : null;

/**
 * Set up user data, including password hash and key generation etc.
 * @param {string} password
 * @return string|null
 */
export const onboard = password => {

	// Generate public & private keys

	// Encrypt private key

	// Pass password, public and encrypted private key to Electron process via IPC

	return "Not implemented.";
}

/**
 * Unlock the system.
 * @param {string} password The user's password.
 * @return boolean
 */
export const unlock = password => {

	// Send password to Electron process via IPC

	return false;
}

export default {
	onboard,
	unlock
};
