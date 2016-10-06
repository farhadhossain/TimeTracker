"use strict";
const electron = require('electron');

const {dialog, Tray} = require('electron');

var nconf = require('nconf');

nconf.argv().env().file({ file: `${__dirname}/settings.prop` });

// Module to control application life.
const app = electron.app;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow, electronScreen;

function createWindow () {
  
  const appIcon = new Tray(`${__dirname}/assets/images/tray.png`)

  // Create the browser window.
  mainWindow = new BrowserWindow({width: 360, height: 625, resizable:false, maximizable: false});

  // and load the index.html of the app.
  if(nconf.get('settings:rememberMe') && nconf.get('settings:user')){
     mainWindow.loadURL(`file://${__dirname}/html/current_contracts.html`);
  }else{
     mainWindow.loadURL(`file://${__dirname}/html/login.html`);
  }

  // Open the DevTools.
  //mainWindow.webContents.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    app.quit();
    mainWindow = null
  });

  mainWindow.webContents.on('crashed', function () {
    const options = {
      type: 'info',
      title: 'Renderer Process Crashed',
      message: 'This process has crashed.',
      buttons: ['Reload', 'Close']
    }
    dialog.showMessageBox(options, function (index) {
      if (index === 0) mainWindow.reload()
      else mainWindow.close()
    })
  });


  mainWindow.on('unresponsive', function () {
    const options = {
      type: 'info',
      title: 'Renderer Process Hanging',
      message: 'This process is hanging.',
      buttons: ['Reload', 'Close']
    }
    dialog.showMessageBox(options, function (index) {
      if (index === 0) mainWindow.reload()
      else mainWindow.close()
    })
  });
  

  startTrackingEvent(); 
  monitor.getActiveWindow(afterGetWindowName, -1, 2);
  /*javaversion(function(err,version){
    console.log("Version is " + version);
  });*/

  electronScreen = electron.screen;
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  ipcMain.removeAllListeners(['asynchronous-message']);
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.


const {ipcMain} = require('electron')
ipcMain.on('asynchronous-message', (event, action, arg1, arg2, arg3) => {
  console.log(action);
  if(action==='loadURL'){
      mainWindow.loadURL(`file://${__dirname}/html/`+arg1);
  }else if(action==='setSize'){
      mainWindow.setSize(arg1, arg2);
  }else if(action==='startClickJs'){
     
  }else if(action==='newWindow'){
      let win = new BrowserWindow({ width: 360, height: 625, resizable:false, maximizable: false, minimizable:false});
      win.setPosition(mainWindow.getPosition()[0] + 370, mainWindow.getPosition()[1]);
      win.loadURL(`file://${__dirname}/html/`+arg1);
      win.show();
      if(arg2 && arg3){
        win.setSize(arg2, arg3);
      }
  }else if(action==='newNotification'){
      let win = new BrowserWindow({width: 300, height: 100, resizable:false, frame: false});
      win.setPosition(screenSize().width-320, 20);
      if(arg1){
        win.loadURL(`file://${__dirname}/html/`+arg1);
      }
      win.show();
      setTimeout(function(){
        win.close();
      },5000);
  }

});



var mouseClick=0, keyType=0, filePath='', isTracking = false, eventSender = null, activeWindow='Unknown';

var startTrackingEvent = function(){
      var gkm = require('gkm');
      if(mouseClick==0 && keyType==0){
          // Listen to all key events (pressed, released, typed) 
          gkm.events.on('key.typed', function(data) {
              if(isTracking){
                keyType++;
              }
              console.log(this.event + ' ' + data);
          });
           
          // Listen to all mouse events (click, pressed, released, moved, dragged) 
          gkm.events.on('mouse.clicked', function(data) {
              if(isTracking){
                mouseClick++;
              }
              console.log(this.event + ' ' + data);
          });

          gkm.events.on('error', function(err) {
             console.log('Error :'+err);
             dialog.showErrorBox('Error','JRE not installed.\nPlease run command: "java -version" on terminal to check.\n'+err);
          });
    }
}; 

ipcMain.on('get-events-request', function(event, arg1) {
   eventSender = event.sender;
   filePath = arg1;
   eventSender.send('get-events-response', filePath,  activeWindow , mouseClick, keyType);
});

ipcMain.on('reset-events-request', function(event, arg1) {
   mouseClick=0;
   keyType=0;
});

ipcMain.on('set-tracking-request', function(event, arg1) {
   isTracking = arg1;
});

 var monitor = require('active-window');
 var afterGetWindowName = function(window){
    try {
      if(window && window.error){
          console.log('Error getting window name');
          activeWindow = 'Unknown';
      }else{
        console.log("App: " + window.app);
        console.log("Title: " + window.title);
        activeWindow = window.title;
     }
    }catch(err) {
      console.log(err);
    } 
};

        
function javaversion(callback) {
    var spawn = require('child_process').spawn('java', ['-version']);
    spawn.on('error', function(err){
        console.log('Got error'+err);
        return callback(err, null);
    })
    spawn.stderr.on('data', function(data) {
        console.log('Got data'+data);
        data = data.toString().split('\n')[0];
        var javaVersion = new RegExp('java version').test(data) ? data.split(' ')[2].replace(/"/g, '') : false;
        if (javaVersion != false) {
            // TODO: We have Java installed
            return callback(null, data);
        } else {
            // TODO: No Java installed

        }
    });
}

function screenSize () {
  const {width, height} = electron.screen.getPrimaryDisplay().workAreaSize
  return {
    width:  width,
    height: height
  }
};


 /*process.on('uncaughtException', function () { 

 });*/

