const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  onReaderDetected: (callback) => ipcRenderer.on('reader-detected', (_, name) => callback(name)),
  onCardInserted: (callback) => ipcRenderer.on('card-inserted', (_, uid) => callback(uid)),
  onCardRemoved: (callback) => ipcRenderer.on('card-removed', () => callback()),
  onReaderRemoved: (callback) => ipcRenderer.on('reader-removed', (_, name) => callback(name)),
  onPcscError: (callback) => ipcRenderer.on('pcsc-error', () => callback())
});

window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  for (const dependency of ['chrome', 'node', 'electron']) {
    replaceText(`${dependency}-version`, process.versions[dependency])
  }
})