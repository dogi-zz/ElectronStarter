const {startServer} = require("./dist/server/server");
const {app, BrowserWindow} = require('electron')

function createWindow(port) {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    autoHideMenuBar: true,
  })

  return win.loadURL(`http://localhost:${port}/app/index.html?port=${port}`);
}

startServer(0).then((port) => {

  app.whenReady().then(() => {
    createWindow(port).then(() => {

    })
    app.on('activate', function () {
      if (BrowserWindow.getAllWindows().length === 0) {
        createWindow().then(() => {
          console.info('createWindow done!')
        });
      }
    })
  })

  app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
  })
});
