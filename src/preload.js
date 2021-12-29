const { ipcRenderer, contextBridge } = require("electron");
// placeholder for now
contextBridge.exposeInMainWorld("api", {
  sendMsg: (msg) => ipcRenderer.send("message", msg),
});
