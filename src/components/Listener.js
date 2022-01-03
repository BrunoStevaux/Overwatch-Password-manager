const { ipcMain } = require("electron");
const logger = require("./Logger");
const db = require("./Database");
const encryption = require("./EncryptionHandler");

// Handle the message invoked by the renderer pretaining to a new account being added
ipcMain.handle("addAccountDetails", async (event, args) => {
  const result = { error: null, data: null };
  const encrypted = encryption.encrypt(args.password);

  try {
    db.insert(
      "INSERT OR IGNORE INTO accounts (email, password, battle_tag) VALUES (?, ?, ?);",
      args.email,
      encrypted,
      args.battleTag,
    );
  } catch (e) {
    logger.error(e);
    result.error = "There was a problem adding the account credentials.";
    return result;
  }

  result.data = args;
  return result;
});

// Handle the request to load all saved accounts
ipcMain.handle("getAccountDetails", async (event, args) => {
  const result = { error: null, data: null };

  try {
    const accounts = db.get("SELECT email, password, battle_tag FROM accounts;");
    result.data = accounts;
    return result;
  } catch (e) {
    logger.error(e);
    result.error = "There was a problem fetching the account credentials.";
    return result;
  }
});

// Handle the request to delete all saved accounts
ipcMain.on("deleteAccounts", async (event, args) => {
  try {
    db.update("DELETE FROM accounts;");
  } catch (e) {
    logger.error(e);
  }
});
