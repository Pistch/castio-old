'use strict';

class Uploader {
  constructor (container) {
    this.container = container;
    this.container.innerHTML = '<input type="file" name="upload">'+
      '<button onclick="uploader.sendTrack()">Upload</button>';
  }


  sendTrack() {
    let file = this.container.querySelector('input').files[0];
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
