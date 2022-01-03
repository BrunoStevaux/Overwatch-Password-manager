const { ipcRenderer, contextBridge } = require("electron");

contextBridge.exposeInMainWorld("api", {
  sendAccountDetails: (account) => ipcRenderer.invoke("addAccountDetails", account),
  getAccounts: () => ipcRenderer.invoke("getAccountDetails"),
  deleteAllAccounts: () => ipcRenderer.send("deleteAccounts"),
});
