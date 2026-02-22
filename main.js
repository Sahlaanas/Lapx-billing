const { app, BrowserWindow, Menu, dialog } = require('electron');
const path = require('path');

let mainWindow;

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
    },
    show: false,
    backgroundColor: '#eef0f5',
  });

  mainWindow.loadFile(path.join(__dirname, 'src', 'index.html'));

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    mainWindow.maximize();
  });

  const menu = Menu.buildFromTemplate([
    {
      label: 'File',
      submenu: [
        {
          label: '🖨️  Print / Save as PDF',
          accelerator: 'CmdOrCtrl+P',
          click: () => {
            mainWindow.webContents.print({}, (success, reason) => {
              if (!success) console.log('Print failed:', reason);
            });
          }
        },
        { type: 'separator' },
        { label: 'Exit', accelerator: 'Alt+F4', click: () => app.quit() }
      ]
    },
    {
      label: 'View',
      submenu: [
        {
          label: 'Zoom In', accelerator: 'CmdOrCtrl+Plus',
          click: () => {
            const z = mainWindow.webContents.getZoomFactor();
            mainWindow.webContents.setZoomFactor(Math.min(z + 0.1, 2.0));
          }
        },
        {
          label: 'Zoom Out', accelerator: 'CmdOrCtrl+-',
          click: () => {
            const z = mainWindow.webContents.getZoomFactor();
            mainWindow.webContents.setZoomFactor(Math.max(z - 0.1, 0.5));
          }
        },
        {
          label: 'Reset Zoom', accelerator: 'CmdOrCtrl+0',
          click: () => mainWindow.webContents.setZoomFactor(1.0)
        },
        { type: 'separator' },
        { label: 'Toggle Full Screen', accelerator: 'F11', role: 'togglefullscreen' }
      ]
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'About',
          click: () => {
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: 'About LAP-X Billing',
              message: 'LAP-X Billing Software v1.0',
              detail: 'LAP-X SOLUTIONS\nMulti Brand Laptop Service Centre\nCalicut (YMCA), Kerala\n\n📞 8137 088990 | 9497632116'
            });
          }
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
