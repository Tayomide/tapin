const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  onReaderDetected: (callback) => ipcRenderer.on('reader-detected', (_, name) => callback(name)),
  onCardInserted: (callback) => ipcRenderer.on('card-inserted', (_, uid) => callback(uid)),
  onCardRemoved: (callback) => ipcRenderer.on('card-removed', () => callback()),
  onReaderRemoved: (callback) => ipcRenderer.on('reader-removed', (_, name) => callback(name)),
  onPcscError: (callback) => ipcRenderer.on('pcsc-error', () => callback()),
  hashHex: (hex) => ipcRenderer.invoke('hash-hex', hex),
  setToken: (token) => ipcRenderer.invoke('set-token', token),
  getToken: () => ipcRenderer.invoke('get-token'),
});

// window.addEventListener('DOMContentLoaded', () => {
//   // Allow external API requests (you can also set more headers here)
//   document.querySelector('head').insertAdjacentHTML('beforeend', `
//     <meta http-equiv="Content-Security-Policy" content="script-src 'self' https://system61.rice.iit.edu">
//   `);
// });

// window.addEventListener('DOMContentLoaded', () => {
//   const replaceText = (selector, text) => {
//     const element = document.getElementById(selector)
//     if (element) element.innerText = text
//   }

//   for (const dependency of ['chrome', 'node', 'electron']) {
//     replaceText(`${dependency}-version`, process.versions[dependency])
//   }
// })