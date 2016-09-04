var monitor = require('active-window');

var callback = function(window){
  try {
    console.log("App: " + window.app);
    console.log("Title: " + window.title);
  }catch(err) {
      //console.log(err);
  } 
}
//monitor.getActiveWindow(callback, -1, 1);

const activeWindow = document.getElementById('active-window')

activeWindow.addEventListener('click', function (event) {

    /*var monitor = require('active-window');

    var callback = function(window){
      try {
        console.log("App: " + window.app);
        console.log("Title: " + window.title);
      }catch(err) {
        console.log(err);
      } 
    }*/
    /*Watch the active window +
      @callback
      @number of requests; infinity = -1 
      @interval between requests
    */
    //monitor.getActiveWindow(callback,-1,1);

    //Get the current active window
    monitor.getActiveWindow(callback);

});
