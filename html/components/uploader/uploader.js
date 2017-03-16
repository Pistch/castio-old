'use strict';

class Uploader {
  constructor (container) {
    this.container = container;
    this.container.innerHTML = '<form name="test" method="post" enctype="multipart/form-data">' + 
    	'<input type="file" name="upload">'+
    	'<button onclick="uploader.sendTrack()">Upload</button>' + '</form>';
  }


  sendTrack() {
    let file = new FormData(this.container.querySelector('form'));
    if (!file) return;
    let xhr = new XMLHttpRequest();

    xhr.open("POST", "/upload", true);
	
	xhr.onload = xhr.onerror = (function() {
      if (this.status == 200) {
        console.log("success");
      } else {
        console.log("error " + xhr.status);
      }
    }).bind(this);

    
    xhr.upload.onprogress = function(event) {
      console.log(event.loaded + ' / ' + event.total);
    };
	
    xhr.send(file);
  }
}
