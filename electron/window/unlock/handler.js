const createWindow = require('../');
const {testPassword} = require('../../data');

module.exports = window => (event, password) =>
	testPassword(password)
		.then(pwValid => {
			if (pwValid) createWindow('app')
				.then(() => window.destroy());
			return pwValid;
		});
