const { app, BrowserWindow, Menu} = require("electron")
if (require('electron-squirrel-startup')) return;
require('electron-reload')(__dirname)
function createWindow()
{
    const mainWindow = new BrowserWindow({
        width: 1024,
        height: 768
    })
    mainWindow.loadFile('src/ui/index.html')
    mainWindow.webContents.openDevTools()
    const menu = Menu.buildFromTemplate([
        {
            label: "File",
            submenu:[
                {label: 'Exit',
                click(){
                    app.quit()
                }
            }
            ]
        },
        {
            label: "About"
        }
    ])
    Menu.setApplicationMenu(menu)
}

app.whenReady().then(() =>{
    createWindow()
})