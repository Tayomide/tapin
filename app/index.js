const { app, BrowserWindow } = require("electron");
const { initializePCSC } = require("./scripts/pcsc.js");
// include the Node.js 'path' module at the top of your file
const path = require("node:path");

let mainWindow;

// TODO: Learn to build electron apps with Vite or electron-forge or
// electron-builder

// modify your existing createWindow() function
const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "scripts/preload.js"),
    },
  });

  mainWindow.loadFile("index.html");
};

app.whenReady().then(() => {
  createWindow();
  initializePCSC(mainWindow);

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
