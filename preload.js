const { contextBridge } = require("electron");

// NOTE: Expose value of WS_PORT to renderer (example/index.js) as well.
contextBridge.exposeInMainWorld("WS_PORT", 8080);
