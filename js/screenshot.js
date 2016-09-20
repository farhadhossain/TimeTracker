"use strict";
const electron = require('electron');
const desktopCapturer = electron.desktopCapturer;
const electronScreen = electron.screen;
const shell = electron.shell;

const fs = require('fs');
const os = require('os');
const path = require('path');

const screenshotImg = document.getElementById('screenshot-image');

module.exports.takeScreenshot = function () {
  console.log('Taking screenshot');
  const thumbSize = determineScreenShotSize()
  let options = { types: ['screen'], thumbnailSize: thumbSize }
   console.log('sdasd');
  desktopCapturer.getSources(options, function (error, sources) {
    if (error) return console.log(error)

    sources.forEach(function (source) {
      if (source.name === 'Entire screen' || source.name === 'Screen 1') {
        const screenshotPath = path.join(os.tmpdir(), new Date().getTime()+'.png')

        fs.writeFile(screenshotPath, source.thumbnail.toPng(), function (error) {
            if (error) return console.log(error)
            //shell.openExternal('file://' + screenshotPath)
            //const message = `Saved screenshot to: ${screenshotPath}`
            $('#screenshot-image').attr('src','file://' + screenshotPath);
            postScreenshot(screenshotPath);
        })
      }
    })
  })
};

function determineScreenShotSize () {
  const screenSize = electronScreen.getPrimaryDisplay().workAreaSize
  const maxDimension = Math.max(screenSize.width, screenSize.height)
  return {
    width: maxDimension * window.devicePixelRatio,
    height: maxDimension * window.devicePixelRatio
  }
};
