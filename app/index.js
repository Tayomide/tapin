const { app, BrowserWindow, ipcMain, session } = require("electron");
require('dotenv').config();
const { initializePCSC } = require("./scripts/pcsc.js");
const { hashHex } = require("./scripts/hash.js");
// include the Node.js 'path' module at the top of your file
const path = require("path");
const Store = require('electron-store').default
const store = new Store()

let mainWindow;

// TODO: Learn to build electron apps with Vite or electron-forge or
// electron-builder

// modify your existing createWindow() function
const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'scripts', 'preload.js'),
    },
  });

  mainWindow.loadFile("index.html");
};


app.whenReady().then(() => {
  createWindow();
  initializePCSC(mainWindow);
  ipcMain.handle('hash-hex', (_, hex) => hashHex(hex));
  ipcMain.handle('get-token', () => store.get('token'));
  ipcMain.handle('set-token', (_, token) => store.set('token', token));
  ipcMain.handle('get-device-info', () => {
    const os = require('os');
    const deviceInfo = `${os.type()} ${os.release()} ${os.arch()}`;
    return deviceInfo;
  })

  // Apply Content Security Policy (CSP)
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': [
          // Allow network connections to the external domain
          'connect-src \'self\' https://system61.rice.iit.edu; default-src \'self\';',
        ],
      }
    })
  })

  // Disable certificate errors for testing purposes
  app.on('certificate-error', (event, webContents, url, error, certificate, callback) => {
    // Prevent the default behavior (which is to block the request)
    event.preventDefault();
    // Allow all certificates (insecure)
    callback(true);
  });
  // session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
  //   callback({
  //     responseHeaders: {
  //       ...details.responseHeaders,
  //       'Content-Security-Policy': ["default-src 'self'; connect-src 'self' https://system61.rice.iit.edu;"],
  //     },
  //   });
  // });

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
