'use strict';

let mongodb = require('mongodb');

	function insertTrackInfo(trackInfo, cb) {
		let MongoClient = mongodb.MongoClient;

		let dbURL = 'mongodb://localhost:27017/castio';
		MongoClient.connect(dbURL, function (err, db) {
		  if (err) {
			console.log('Unable to connect to the mongoDB server. Error:', err);
		  } else {
			console.log('Connection established to', dbURL);
			
			let tracksDB = db.collection('tracks');
			
			    tracksDB.insert(trackInfo, function (err, result) {
				  if (err) {
					console.log(err);
				  } else {
					console.log(result.length, result);
					cb(result.ops[0]._id);
				  }
				  db.close();
				});

			db.close();
		  }
		});
	};
	
	function findTrackInfo(trackInfo, cb) {
		let MongoClient = mongodb.MongoClient;

		let dbURL = 'mongodb://localhost:27017/castio';
		MongoClient.connect(dbURL, function (err, db) {
		  if (err) {
			console.log('Unable to connect to the mongoDB server. Error:', err);
		  } else {
			console.log('Connection established to', dbURL);
			
			let collection = db.collection('tracks');
			
			    collection.find(/*trackInfo*/).toArray(function (err, result) {
				  if (err) {
					console.log(err);
				  } else if (result.length) {
					cb(result);
				  } else {
					cb(null);
					console.log('No document(s) found with defined "find" criteria!');
				  }
				  //Close connection
				  db.close();
				});
			
			//Close connection
			db.close();
		  }
		});
	};
exports.getTrackInfo = findTrackInfo;
exports.insertTrackInfo = insertTrackInfo;
