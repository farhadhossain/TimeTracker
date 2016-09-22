"use strict";
const electron = require('electron');

// Module to control application life.
const app = electron.app;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 450, height: 783});

  // and load the index.html of the app.
  mainWindow.loadURL(`file://${__dirname}/html/login.html`);

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
   
  /*if (externalDisplay) {
    win = new BrowserWindow({
      x: externalDisplay.bounds.x + 50,
      y: externalDisplay.bounds.y + 50
    })
    win.loadURL('https://github.com')
  }*/

  startTrackingEvent(); 
  
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
      let win = new BrowserWindow({titleBarStyle: 'hidden', width: 450, height: 783});
      win.setPosition(mainWindow.getPosition()[0] + 460, mainWindow.getPosition()[1]);
      win.loadURL(`file://${__dirname}/html/`+arg1);
      win.show();
  }
});



var mouseClick=0, keyType=0, filePath='', isTracking = false, eventSender = null;

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
    }
}; 

ipcMain.on('get-events-request', function(event, arg1) {
   eventSender = event.sender;
   filePath = arg1;
   monitor.getActiveWindow(afterGetWindowName);
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
      console.log("App: " + window.app);
      console.log("Title: " + window.title);
      eventSender.send('get-events-response', filePath,  window.title, mouseClick, keyType);
    }catch(err) {
      console.log(err);
    } 
};

        

