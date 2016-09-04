// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
"use strict";

module.exports.openWin = function(){
	const {BrowserWindow} = require('electron').remote;
	let win = new BrowserWindow({width: 400, height: 600});
	win.loadURL('https://github.com');
};

module.exports.getName = function(){
  return '';
};


/*module.exports.captureDesktop =function(){

		const desktopCapturer = require('electron');

		desktopCapturer.getSources({types: ['window', 'screen']}, (error, sources) => {
		  if (error) throw error
		  for (let i = 0; i < sources.length; ++i) {
		    if (sources[i].name === 'Electron') {
		      navigator.webkitGetUserMedia({
		        audio: false,
		        video: {
		          mandatory: {
		            chromeMediaSource: 'desktop',
		            chromeMediaSourceId: sources[i].id,
		            minWidth: 1280,
		            maxWidth: 1280,
		            minHeight: 720,
		            maxHeight: 720
		          }
		        }
		      }, handleStream, handleError);
		      return;
		    }
		  }
		});

		function handleStream (stream) {
		  document.querySelector('video').src = URL.createObjectURL(stream);
		}

		function handleError (e) {
		  console.log(e);
		}

};*/

module.exports.createFramelessWindow = function(){
	const {BrowserWindow} = require('electron').remote;
	let win = new BrowserWindow({titleBarStyle: 'hidden', width: 400, height: 600});
	win.show();
};
