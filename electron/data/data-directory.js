const {join} = require('path');
const {mkdirSync} = require('fs');

const {app} = require('electron');

const DATA_DIR = join(app.getPath('home'), '.lock-and-key');

// Create the directory if needed
mkdirSync(DATA_DIR, {recursive: true, mode: 0o700});

/**
 * The directory where user's data for this app is stored.
 * @type string
 */
module.exports = DATA_DIR;
