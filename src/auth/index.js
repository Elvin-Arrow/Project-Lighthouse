const { app, BrowserWindow, ipc } = require('electron')


function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 500,
    height: 500,
    // frame: false,
    
    webPreferences: {
      nodeIntegration: true
    }
  });

  // Bring the window to focus
  win.focus();

  // and load the index.html of the app.
  win.loadFile('index.html');


  // Open the DevTools.
  win.webContents.openDevTools()

  // Remove menu
  //win.removeMenu();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.whenReady().then(createWindow)

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})
