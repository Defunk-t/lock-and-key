const {contextBridge} = require('electron');

contextBridge.exposeInMainWorld('test', () => console.log("Test"));
