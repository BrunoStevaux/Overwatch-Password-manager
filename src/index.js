const { app, BrowserWindow } = require("electron");
const path = require("path");
const database = require("./components/Database");
const logger = require("./components/Logger");
require("./components/Listener");

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
// eslint-disable-next-line global-require
if (require("electron-squirrel-startup")) app.quit();

const createWindow = () => {
  logger.info("Starting new session...");
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    title: "Overwatch Password Manager",
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(`${__dirname}/preload.js`),
    },
    sandbox: true,
  });

  try {
    database.setup();
  } catch (e) {
    logger.error(e);
  }

  mainWindow.loadFile(path.join(__dirname, "renderer/html/index.html"));
  mainWindow.webContents.openDevTools({ mode: "bottom" });

  // Prevent the default title from being used
  mainWindow.on("page-title-updated", (event) => {
    event.preventDefault();
  });
};

// Called when Electron is ready to create browser windows
app.on("ready", createWindow);

// Quit the app when all windows are closed
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    logger.info("Shutting down...");
    app.quit();
  }
});

// Open a window when the app activates and there are no active windows
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
