// optimiser avec le cache via l'API de V8
require('v8-compile-cache');

const { app, BrowserWindow, ipcMain, shell } = require('electron');
const path = require('path');

const { request } = require("@octokit/request");

let mainWindow = null;
let splash = null;
let urlUpdate = null;

// OLD // Handle creating/removing shortcuts on Windows when installing/uninstalling.
// if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
//     app.quit();
// }

/// DÉBUT SQUIRREL EVENT POUR DÉSINSTALLATION COMPLÈTE
if (require('electron-squirrel-startup')) return;
// this should be placed at top of main.js to handle setup events quickly
if (handleSquirrelEvent()) {
    // squirrel event handled and app will exit in 1000ms, so don't do anything else
    return;
}

function handleSquirrelEvent() {
    if (process.argv.length === 1) {
        return false;
    }
    const ChildProcess = require('child_process');
    const path = require('path');
    const appFolder = path.resolve(process.execPath, '..');
    const rootAtomFolder = path.resolve(appFolder, '..');
    const updateDotExe = path.resolve(path.join(rootAtomFolder, 'Update.exe'));
    const exeName = path.basename(process.execPath);
    const spawn = function(command, args) {
        let spawnedProcess, error;

        try {
            spawnedProcess = ChildProcess.spawn(command, args, { detached: true });
        } catch (error) {}

        return spawnedProcess;
    };
    const spawnUpdate = function(args) {
        return spawn(updateDotExe, args);
    };
    const squirrelEvent = process.argv[1];
    switch (squirrelEvent) {
        case '--squirrel-install':
        case '--squirrel-updated':
            // Optionally do things such as:
            // - Add your .exe to the PATH
            // - Write to the registry for things like file associations and
            //   explorer context menus
            // Install desktop and start menu shortcuts
            spawnUpdate(['--createShortcut', exeName]);
            setTimeout(app.quit, 1000);
            return true;
        case '--squirrel-uninstall':
            // Undo anything you did in the --squirrel-install and
            // --squirrel-updated handlers
            // Remove desktop and start menu shortcuts
            spawnUpdate(['--removeShortcut', exeName]);
            setTimeout(app.quit, 1000);
            return true;
        case '--squirrel-obsolete':
            // This is called on the outgoing version of your app before
            // we update to the new version - it's the opposite of
            // --squirrel-updated
            app.quit();
            return true;
    }
};
/// FIN SQUIRREL EVENT

const createWindow = () => {

    //SPLASH
    // splash = new BrowserWindow({
    //     show: false,
    //     webPreferences: {
    //         worldSafeExecuteJavaScript: true,
    //         nodeIntegration: false, // is default value after Electron v5
    //         contextIsolation: true, // protect against prototype pollution
    //         enableRemoteModule: false, // turn off remote
    //     },
    //     width: 500,
    //     height: 300,
    //     frame: false,
    //     icon: __dirname + '/img/chou.ico',
    //     backgroundColor: '#000000'
    // });
    // splash.loadFile(__dirname + '/img/splash.gif');
    // splash.setAlwaysOnTop(true, 'screen');
    // splash.show();

    // fenetre principale
    mainWindow = new BrowserWindow({
        show: false,
        webPreferences: {
            worldSafeExecuteJavaScript: true,
            nodeIntegration: false, // is default value after Electron v5
            contextIsolation: true, // protect against prototype pollution
            enableRemoteModule: false, // turn off remote
            preload: path.join(__dirname, "preload.js") // use a preload script
        },
        frame: false,
        fullscreen: true,
        icon: __dirname + '/img/chou.ico',
        backgroundColor: '#000000'
    });
    // cacher le menu de la fenetre
    mainWindow.setMenu(null);
    mainWindow.minimize();


    // // DEV FENETRE PRINCIPALE
    // mainWindow.setAlwaysOnTop(true, 'screen');
    // mainWindow.show();
    // mainWindow.maximize();
    // mainWindow.setAlwaysOnTop(false, 'screen');
    // mainWindow.webContents.openDevTools();
    // mainWindow.setResizable(false);
    // mainWindow.setMovable(false);
    // mainWindow.loadFile(__dirname + '/index.html');
    // // FIN DEV


    // setTimeout(function() {
    //PROD
    mainWindow.loadFile(__dirname + '/index.html');
    mainWindow.maximize();
    mainWindow.setResizable(false);
    mainWindow.setMovable(false);
    mainWindow.setAlwaysOnTop(true, 'screen');
    mainWindow.show();
    mainWindow.setAlwaysOnTop(false, 'screen');
    // FIN PROD
    // }, 500);


    ipcMain.on('envoi-splash-fin', function() {
        // splash.destroy();
    })
    ipcMain.on('envoi-fermer', function() {
        // splash.isDestroyed ? '' : splash.close();
        mainWindow.close();
    })
    ipcMain.on('envoi-reduire', function() {
        mainWindow.minimize();
    })
    ipcMain.on('envoi-volOn', function() {
        mainWindow.webContents.setAudioMuted(false);
    })
    ipcMain.on('envoi-volOff', function() {
        mainWindow.webContents.setAudioMuted(true);
    })

    ipcMain.on('envoi-maj', function() {
        if (urlUpdate.startsWith('https://github.com/Lob2018/Choux-Win/releases/download/')) shell.openExternal(urlUpdate);
    })

    // vérifier si maj disponible
    ipcMain.on('envoi-maj-dispo', async function(event) {
        let code;
        let retour;
        try {
            retour = await request('GET /repos/{owner}/{repo}/releases', {
                owner: 'Lob2018',
                repo: 'Choux-Win'
            })
            urlUpdate = retour.data[0].assets[0].browser_download_url;
            code = 0;
        } catch (e) {
            retour = e;
            code = 1;
        } finally {
            event.sender.send('retour-maj-dispo', { val: code, version: app.getVersion(), rep: retour });
        }
    })
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);
// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});