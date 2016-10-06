"use strict";
const electron = require('electron');
const desktopCapturer = electron.desktopCapturer;
const electronScreen = electron.screen;
const shell = electron.shell;

const fs = require('fs');
const os = require('os');
const path = require('path');

const screenshotImg = document.getElementById('screenshot-image');

var nconf = require('nconf');
nconf.argv().env().file({ file: `${__dirname}/../settings.prop` });

var thumbSize = determineScreenShotSize();
var capture = nconf.get('settings:capture');

module.exports.takeScreenshot = function () {
  
  nconf.file({ file: `${__dirname}/../settings.prop` });

  capture = nconf.get('settings:capture');

  console.log('Taking screenshot');

  let ratio = thumbSize.width/thumbSize.height;
  switch(nconf.get('settings:resolution')){
     case 'mid':
           thumbSize = {width:thumbSize.width/2, height : thumbSize.width/2*ratio};
           break;
      case 'low':
           thumbSize = {width:thumbSize.width/3, height : thumbSize.width/3*ratio};
           break;     

  }
  let options = { types: ['screen'], thumbnailSize: thumbSize }

  desktopCapturer.getSources(options, function (error, sources) {

    if (error) return console.log(error)
    
    console.log('Removing temp directory');
    deleteFolderRecursive(path.join(os.tmpdir(),'ss')); 
    fs.mkdir(path.join(os.tmpdir(),'ss'), function(err) {console.log(err);});

    sources.forEach(function (source) {
      console.log(JSON.stringify(source));
      //if (source.name === 'Entire screen' || source.name === 'Screen 1') {
        const screenshotPath = path.join(path.join(os.tmpdir(),'ss'), source.name+'.png')
        fs.writeFile(screenshotPath, source.thumbnail.toPng(), function (error) {
            if (error) return console.log(error)
        });
      //}
    });

   processImages();


  });
};

function processImages(){
     
     var finalPath = path.join(path.join(os.tmpdir(),'ss'), new Date().getTime()+'.png');

    fs.readdir(path.join(os.tmpdir(),'ss'), function(err, files){

      if(files.length>1 && capture=='all'){

        var canvas = document.createElement('canvas');
        canvas.width = thumbSize.width*2;
        canvas.height = thumbSize.height;
        var ctx = canvas.getContext('2d');

        var img = new Image();
        img.src = path.join(path.join(os.tmpdir(),'ss'), files[0]);
        img.onload = function () {
            ctx.drawImage(this, 0, 0, this.width , this.height); 
            var img = new Image();
            img.src = path.join(path.join(os.tmpdir(),'ss'), files[1]);
            img.onload = function () {
                ctx.drawImage(this, this.width , 0, this.width , this.height); 
                var base64Data = canvas.toDataURL();
                var data = base64Data.replace(/^data:image\/\w+;base64,/, '');
                fs.writeFile(finalPath, data, {encoding: 'base64'}, function(err) {
                  console.log(err);
                  postScreenshot(finalPath);
                });
            };
        };
      }else if(files.length>1){
          fs.rename(path.join(path.join(os.tmpdir(),'ss'), 'Screen 1.png'), finalPath, function (err) {postScreenshot(finalPath);});
      }else{
          fs.rename(path.join(path.join(os.tmpdir(),'ss'), 'Entire screen.png'), finalPath, function (err) {postScreenshot(finalPath);});
      }


  });
   
  

};


var deleteFolderRecursive = function(path) {
  if( fs.existsSync(path) ) {
    fs.readdirSync(path).forEach(function(file,index){
      var curPath = path + "/" + file;
      if(fs.lstatSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursive(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
};

function determineScreenShotSize () {
  const screenSize = electronScreen.getPrimaryDisplay().workAreaSize
  const maxDimension = Math.max(screenSize.width, screenSize.height)
  return {
    width: maxDimension * window.devicePixelRatio,
    height: maxDimension * window.devicePixelRatio
  }
};
