var level = require('level');
var serve = require('level-serve');
var multilevel = require('multilevel/msgpack');
var addServer = require('..');
var net = require('net');
var http = require('http');
var createManifest = require('level-manifest');
var fs = require('fs');

// initialize db and static file server
var db = level(__dirname + '/.simple-db', { valueEncoding: 'binary' });

// create static file server and add it to the db
var server = serve(db);
addServer(db, server);

// create a level-manifest and write to disk
var manifest = JSON.stringify(createManifest(db));
fs.writeFileSync(__dirname + '/manifest.json', manifest);

// expose db using multilevel
net.createServer(function (stream) {
  stream.pipe(multilevel.server(db)).pipe(stream);
}).listen(3000);

// start listening on http port 8000
http.createServer(function (req, res) {
  server.serve(req, res);
}).listen(8000);
