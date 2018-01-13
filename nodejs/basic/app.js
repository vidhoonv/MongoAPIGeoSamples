var MongoClient = require('mongodb').MongoClient
var ReadPreference = require('mongodb').ReadPreference
  , assert = require('assert');

// Connection URL
var url = 'YOUR-CONNECTION-STRING-HERE';

function doOps(client) {
  setTimeout(writeDoc, 1000, client);
}

function writeDoc(client) {
  var query = {};
  var writecoll = client.db('sampleDB').collection('sampleColl');
  writecoll.insertMany([
    {a : 1}
  ], function(err, result) {
    assert.equal(err, null);
    assert.equal(1, result.result.n);
    readDoc(client, result.insertedIds[0]);
  });
}

function readDoc(client, doc_id) {
  var query = {"_id": doc_id};
  var readcoll = client.db('sampleDB').collection('sampleColl');
  readcoll.find(query).toArray(function(err, data) {
    assert.equal(null, err);
    console.log("readDoc completed! "+JSON.stringify(data));
  });
}

// Use connect method to connect to the server
MongoClient.connect(url, function(err, client) {
  assert.equal(null, err);
  console.log("Connected successfully to server");
  
 setInterval(doOps, 1000, client);

});
