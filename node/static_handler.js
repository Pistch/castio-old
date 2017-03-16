'use strict';

const stat = require('node-static');

let webcontent = new stat.Server('../html');
let music = new stat.Server('/mnt/disk2/audio_files');

function sendStaticContent(request, response) {
	console.log('serving static content from ' + request.url);

    request.addListener('end', function () {
    	if (request.url.indexOf('.mp3') != -1) {
    		request.url = request.url.slice(request.url.lastIndexOf('/'));
		music.serve(request, response);
    		return;
    	};
        webcontent.serve(request, response);
    }).resume();
};

exports.sendStaticContent = sendStaticContent;