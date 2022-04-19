const {join} = require('path');
const {app} = require('electron');

/**
 * The directory where user's data for this app is stored.
 * @type string
 */
module.exports = join(app.getPath('home'), '.lock-and-key');
