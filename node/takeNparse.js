'use strict';
const mm = require('music-metadata');
const formidable = require('formidable');
const fs = require('fs');
const util = require('util');

let dbWork = require('./dbWork.js');

let takeNparse = function(req, res) {
  if (req.url == '/upload') {
	let form = new formidable.IncomingForm();
	form.uploadDir = "/mnt/disk2";
	
	form.on('end', function() {
	  res.writeHead(200, {'content-type': 'text/html'});
	  res.write('ok');
	  res.end();	
	});
	form.parse(req, function(err, fields, files) {
		try {
		  //if (!files.upload) throw new Error('No file uploaded!');
		  console.log(files);
		  if (files.upload.name.indexOf('.mp3') == -1) throw new Error('Not a track!');
		  mm.parseStream(fs.createReadStream(files.upload.path), (error, metadata) => {
			if (error) console.log(error);
			console.log('parsing metadata...');
			let renameNewUpload = function(name) {
				name = '/mnt/disk2/audio_files/' + name + '.mp3';
				fs.rename(files.upload.path, name, (e) => console.log(e));
			};
			
			let neededMeta = {
				'title': metadata['common'].title,
				'artist': metadata.common.artist,
				'album': metadata.common.album,
				'duration': metadata.format.duration
			};
			console.log('going to insert meta to db...');
			dbWork.insertTrackInfo(neededMeta, renameNewUpload);
			
		  });

		} catch(error) {
			console.log(error);
		};
	});
	
	
	return;
  };
};
  
  
exports.takeNparse = takeNparse;



