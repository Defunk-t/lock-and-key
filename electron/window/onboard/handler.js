const createWindow = require('../');
const {onboard} = require('../../data');

module.exports = window => (event, password) =>
	onboard(password)
		.then(() => createWindow('app'))
		.then(() => window.destroy());
