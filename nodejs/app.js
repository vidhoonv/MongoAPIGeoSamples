//Documentation, Examples on node js driver and readpreference usage:
//https://mongodb.github.io/node-mongodb-native/driver-articles/anintroductionto1_1and2_2.html

var MongoClient = require('mongodb').MongoClient
var ReadPreference = require('mongodb').ReadPreference
  , assert = require('assert');

// Connection URL
var url = 'mongodb://<dbaccname>:<password>@<docdbendpoint>:<port>/<dbname>?ssl=true&replicaSet=globaldb';


//inserts done here go to the write region (PRIMARY)
var insertDocuments = function(db, callback) {
  // Get the documents collection
  var collection = db.collection('documents');
  // Insert some documents
  collection.insertMany([
    {a : 1}, {a : 2}, {a : 3}
  ], function(err, result) {
    assert.equal(err, null);
    assert.equal(3, result.result.n);
    assert.equal(3, result.ops.length);
    console.log("Inserted 3 documents into the collection");
    callback(result);
  });
}

//read from write region
var findDocumentsFromWriteRegion = function(db, callback) {
  // Get the documents collection
  var collection = db.collection('documents');
  // Find some documents
  // ReadPreference.PRIMARY -> makes sure you read from Write region
  collection.find({}).setReadPreference(new ReadPreference(ReadPreference.PRIMARY)).toArray(function(err, docs) {
    assert.equal(err, null);
    console.log("Found the following records from write region");
    console.log(docs)
    callback(docs);
  });
}

//read from nearest region
var findDocumentsFromNearestRegion = function(db, callback) {
  // Get the documents collection
  var collection = db.collection('documents');
  // Find some documents
  // ReadPreference.NEAREST -> makes sure you read from Nearest region
  collection.find({}).setReadPreference(new ReadPreference(ReadPreference.NEAREST)).toArray(function(err, docs) {
    assert.equal(err, null);
    console.log("Found the following records from nearest region");
    console.log(docs)
    callback(docs);
  });
}


//read from specifc region
var findDocumentsFromSpecificRegion = function(db, callback) {
  // Get the documents collection
  var collection = db.collection('documents');
  // Find some documents
  collection.find({}).setReadPreference(new ReadPreference(ReadPreference.SECONDARY, { "region" : "West US"})).toArray(function(err, docs) {
    assert.equal(err, null);
    console.log("Found the following records from specific region");
    console.log(docs)
    callback(docs);
  });
}


//read from read region
var findDocumentsFromReadRegion = function(db, callback) {
  // Get the documents collection
  var collection = db.collection('documents');
  // Find some documents
  // ReadPreference.SECONDARY -> makes sure you read from Read region
  collection.find({}).setReadPreference(new ReadPreference(ReadPreference.SECONDARY)).toArray(function(err, docs) {
    assert.equal(err, null);
    console.log("Found the following records from read region");
    console.log(docs)
    callback(docs);
  });
}


// Use connect method to connect to the server
MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  console.log("Connected successfully to server");

  insertDocuments(db, function() {
   findDocumentsFromWriteRegion(db, function() {
      findDocumentsFromNearestRegion(db, function() {
       findDocumentsFromSpecificRegion(db, function() {
        findDocumentsFromReadRegion(db, function() {
         db.close();
        });
       });
      });
    });
  });

});
