var MongoClient = require('mongodb').MongoClient
var ReadPreference = require('mongodb').ReadPreference
  , assert = require('assert');
//var pass = encodeURIComponent('YOUR-PASSWORD')
// Connection URL
var url = 'PASTE YOUR CONNECTION STRING HERE';
function doReads(client) {
  setTimeout(readDefaultfunc, 1000, client);
  setTimeout(readFromSecondaryfunc, 1000, client);
  setTimeout(readFromNearestfunc, 1000, client);

  }

  function readDefaultfunc(client) {
    var query = {};
    var readcoll = client.db('regionDB').collection('regionTest');
    readcoll.find(query).toArray(function(err, data) {
      assert.equal(null, err);
      console.log("readDefaultfunc query completed!");
    });
  }

  function readFromSecondaryfunc(client) {
    var query = {};
    var readcoll = client.db('regionDB').collection('regionTest', {readPreference: ReadPreference.SECONDARY});
    readcoll.find(query).toArray(function(err, data) {
      assert.equal(null, err);
      console.log("readFromSecondaryfunc query completed!");
    });
  }

function readFromNearestfunc(client) {
  var query = {};
  var readcoll = client.db('regionDB').collection('regionTest', {readPreference: ReadPreference.NEAREST});
  readcoll.find(query).toArray(function(err, data) {
    assert.equal(null, err);
    console.log("readFromNearestfunc query completed!");
  });
}

// Use connect method to connect to the server
MongoClient.connect(url, {
  autoReconnect : true
}, function(err, client) {
  assert.equal(null, err);
  console.log("connected!");

  setInterval(doReads, 1000, client); 
});