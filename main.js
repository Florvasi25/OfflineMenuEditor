const { app, BrowserWindow, Menu, shell} = require("electron")


if (require('electron-squirrel-startup')) return;
require('electron-reload')(__dirname)
function createWindow()
{
    const mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false, 
          },
        width: 1024,
        height: 768,
        minWidth: 750,
        icon: `${__dirname}/assets/FlipdishIcon.ico`,
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
            label: "About",
            click(){
                shell.openExternal('https://github.com/Florvasi25/OfflineMenuEditor')
            }
        }
    ])
    Menu.setApplicationMenu(menu)
}

app.whenReady().then(() =>{
    createWindow()
})