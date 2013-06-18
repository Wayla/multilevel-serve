var getServer = require('..');
var net = require('net');
var fs = require('fs');
var multilevel = require('multilevel/msgpack');

// get the manifest from the server
var manifest = require('./manifest.json');

// create a multilevel client from that manifest
// and connect it to the server
var db = multilevel.client(manifest);
db.pipe(net.connect(3000)).pipe(db);

// get the server object from the db
var server = getServer(db);

// store cat in server
fs.createReadStream(__dirname + '/cat.png')
  .pipe(server.createWriteStream('cat.png'))
  .on('close', function () {
    server.url('cat.png', function (err, url) {
      console.log('open http://localhost:8000' + url);
    });
  });
