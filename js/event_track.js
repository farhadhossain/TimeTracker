"use strict";
/*var keypress = require('keypress'), tty = require('tty');
keypress(process.stdin);
 
// listen for the "keypress" event 
process.stdin.on('keypress', function (ch, key) {
  console.log('got "keypress"', key);
  if (key && key.ctrl && key.name == 'c') {
    process.stdin.pause();
  }
});

keypress.enableMouse(process.stdout);
 
process.stdin.on('mousepress', function (info) {
  console.log('got "mousepress" event at %d x %d', info.x, info.y);
});
 
process.on('exit', function () {
  // disable mouse on exit, so that the state  
  // is back to normal for the terminal 
  keypress.disableMouse(process.stdout);
});*/

process.stdin.resume(); 
//process.stdin.setRawMode(true);
process.stdin.on('data', function (info) {
  console.log('got "mousepress" event at');
});
 



const robotTest = document.getElementById('robot-test')

robotTest.addEventListener('click', function (event) {

  var robot = require("robotjs");

  //Get the mouse position, retuns an object with x and y. 
  var mouse=robot.getMousePos();
  console.log("Mouse is at x:" + mouse.x + " y:" + mouse.y);

  //Move the mouse down by 100 pixels.
  robot.moveMouse(mouse.x+900,mouse.y+100);

  //Left click!
  robot.mouseClick();

});



