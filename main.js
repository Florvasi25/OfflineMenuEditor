const { app, BrowserWindow, Menu} = require("electron")
require('electron-reload')(__dirname)
function createWindow()
{
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600

    })
    mainWindow.loadFile('src/ui/index.html')
    mainWindow.webContents.openDevTools()
    let menu = Menu.buildFromTemplate([
        {
            label: "File",
            submenu:[
                {label: 'Load JSON'},
                {label: 'Save JSON'},
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