const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  savePDF:         (invoiceNo) => ipcRenderer.invoke('save-pdf', invoiceNo),
  openBillsFolder: ()          => ipcRenderer.invoke('open-bills-folder'),
  onTriggerSave:   (callback)  => ipcRenderer.on('trigger-save-pdf', callback),
});
