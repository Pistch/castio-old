'use strict';

const http = require('http');
const url = require('url');
const querystring = require('querystring');
const fs = require('fs');
const util = require('util');


let takeNparse = require('./takeNparse.js').takeNparse;
let dbWork = require('./dbWork.js');
let sc = require('./static_handler.js').sendStaticContent;

function accept(req, res) {

  console.log('got a request for ' + req.url + ' from ' + req.connection.remoteAddress.substr(req.connection.remoteAddress.lastIndexOf(':')+1));
  
  if (req.url.indexOf('/api/') != -1) {
		res.writeHead(200, {'content-type': 'text/plain'});
		let resultObj = {};
		let temp = req.url.slice(req.url.lastIndexOf('/') + 1).split('&');
		for (let i = 0; i < temp.length; i++) {
			resultObj[temp[i].split('=')[0]] = temp[i].split('=')[1];
		};
		console.log(resultObj);
    function replyWithTracksObj(obj) {
      for (let i=0; i < obj.length; i++) {
        obj[i].filename = obj[i]._id + '.mp3';
        delete(obj[i]._id);
      };
      console.log(obj);
      res.end(JSON.stringify(obj));
    };
    dbWork.getTrackInfo('blah blah blah', replyWithTracksObj);
		
		return;
  };
  
  if (req.url == '/upload') {
	  takeNparse(req,res);
	  return;
  };
  
  if (req.url == '/uploadForm') {
	res.writeHead(200, {'content-type': 'text/html'});
    res.end(
      '<form action="/upload" enctype="multipart/form-data" method="post">'+
      '<input type="file" name="upload" multiple="multiple"><br>'+
      '<input type="submit" value="Upload">'+
      '</form>'
    );  
  };
  
  sc(req, res);

}

let castio = http.createServer(accept).listen(80);
castio.timeout = 60000;
