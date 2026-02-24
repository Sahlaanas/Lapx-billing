const { app, BrowserWindow, Menu, dialog, ipcMain, shell } = require('electron');
const path = require('path');
const fs   = require('fs');

let mainWindow;

// ── Bills folder: next to the exe (installed) or project root (dev) ──
function getBillsFolder() {
  const base = app.isPackaged
    ? path.dirname(app.getPath('exe'))
    : __dirname;
  const folder = path.join(base, 'Bills');
  if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true });
  return folder;
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1100,
    minHeight: 700,
    title: 'LAP-X Billing Software',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
    show: false,
    backgroundColor: '#eef0f5',
  });

  mainWindow.loadFile(path.join(__dirname, 'src', 'index.html'));

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    mainWindow.maximize();
  });

  // ── IPC: save PDF ──────────────────────────────────────────────
  ipcMain.handle('save-pdf', async (event, invoiceNo) => {
    const folder   = getBillsFolder();
    const fileName = `${invoiceNo || 'Invoice'}.pdf`;
    const filePath = path.join(folder, fileName);
    try {
      const data = await mainWindow.webContents.printToPDF({
        printBackground: false,
        pageSize: 'A4',
        margins: { marginType: 'custom', top: 0.4, bottom: 0.4, left: 0.4, right: 0.4 },
      });
      fs.writeFileSync(filePath, data);
      return { success: true, filePath, folder };
    } catch (err) {
      return { success: false, error: err.message };
    }
  });

  // ── IPC: open Bills folder ─────────────────────────────────────
  ipcMain.handle('open-bills-folder', async () => {
    const folder = getBillsFolder();
    shell.openPath(folder);
    return folder;
  });

  // ── Menu ───────────────────────────────────────────────────────
  const menu = Menu.buildFromTemplate([
    {
      label: 'File',
      submenu: [
        {
          label: '💾  Save as PDF',
          accelerator: 'CmdOrCtrl+S',
          click: () => mainWindow.webContents.send('trigger-save-pdf'),
        },
        {
          label: '🖨️  Print',
          accelerator: 'CmdOrCtrl+P',
          click: () => mainWindow.webContents.print({}, (success, reason) => {
            if (!success) console.log('Print failed:', reason);
          }),
        },
        {
          label: '📁  Open Bills Folder',
          accelerator: 'CmdOrCtrl+B',
          click: () => shell.openPath(getBillsFolder()),
        },
        { type: 'separator' },
        { label: 'Exit', accelerator: 'Alt+F4', click: () => app.quit() }
      ]
    },
    {
      label: 'View',
      submenu: [
        { label: 'Zoom In',    accelerator: 'CmdOrCtrl+Plus', click: () => { const z = mainWindow.webContents.getZoomFactor(); mainWindow.webContents.setZoomFactor(Math.min(z+0.1,2.0)); } },
        { label: 'Zoom Out',   accelerator: 'CmdOrCtrl+-',    click: () => { const z = mainWindow.webContents.getZoomFactor(); mainWindow.webContents.setZoomFactor(Math.max(z-0.1,0.5)); } },
        { label: 'Reset Zoom', accelerator: 'CmdOrCtrl+0',    click: () => mainWindow.webContents.setZoomFactor(1.0) },
        { type: 'separator' },
        { label: 'Toggle Full Screen', accelerator: 'F11', role: 'togglefullscreen' }
      ]
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'About',
          click: () => dialog.showMessageBox(mainWindow, {
            type: 'info',
            title: 'About LAP-X Billing',
            message: 'LAP-X Billing Software v1.0',
            detail: 'LAP-X SOLUTIONS\nMulti Brand Laptop Service Centre\nCalicut (YMCA), Kerala\n\n📞 8137 088990'
          })
        }
      ]
    }
  ]);

  Menu.setApplicationMenu(menu);
}

app.whenReady().then(createWindow);
app.on('window-all-closed', () => app.quit());
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
