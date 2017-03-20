'use strict';

class Uploader {
  constructor (container) {
    this.container = container;
    this._initIface();
  }

  _initIface () {
  	this.container.innerHTML = '<form name="test" method="post" enctype="multipart/form-data">' + 
    	'<input type="file" name="upload">'+'</form>' + 
    	'<button onclick="uploader.sendTrack()">Upload</button>' +
      '<div style="float: left; color: red">Notice me!</div>';
  }

  sendTrack() {
    let file = new FormData(this.container.querySelector('form'));
    if (!file) return;
    let xhr = new XMLHttpRequest();
    this.container.innerHTML = '';
    let progress = document.createElement('progress');
    progress.value = 0;
    this.container.appendChild(progress);

    xhr.open("POST", "/upload", true);
	
	xhr.onload = xhr.onerror = (function() {
      if (this.status == 200) {
        console.log("success");
        this._initIface();
        library.getListFromServer();
      } else {
        console.log("error " + xhr.status);
        this._initIface();
        library.getListFromServer();
      }
    }).bind(this);

    
    xhr.upload.onprogress = function(event) {
      progress.value = (+event.loaded) / (+event.total);
    };
	
    xhr.send(file);
  }
}
