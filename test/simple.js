var test = require('tap').test;
var level = require('level');
var serve = require('level-serve');
var multilevel = require('multilevel/msgpack');
var addServer = getServer = require('..');
var net = require('net');
var http = require('http');
var createManifest = require('level-manifest');
var fs = require('fs');
var request = require('hyperquest');

test('simple', function (t) {
  t.plan(1);

  setupServer(function (manifest, hs, ns, db) {
    // yay to destructuring assignment
    var obj = setupClient(manifest, ns);
    var con = obj.con;
    var server = obj.server;

    fs.createReadStream(__dirname + '/../example/cat.png')
      .pipe(server.createWriteStream('cat.png'))
      .on('close', function () {
        server.url('cat.png', function (err, url) {
          if (err) throw err;

          var data = '';
          request('http://localhost:' + hs.address().port + url)
            .on('data', function (d) { data += d })
            .on('end', function () {
              t.equal(data, fs.readFileSync(__dirname + '/../example/cat.png', 'utf8'));
              con.destroy();
              hs.close();
              ns.close();
              db.close();
            });
        });
      });
  });
});

function setupClient (manifest, ns) {
  var db = multilevel.client(manifest);
  var con = net.connect(ns.address().port);
  db.pipe(con).pipe(db);
  return {
    con: con,
    server: getServer(db)
  }
}

function setupServer (cb) {
  var db = level(__dirname + '/.simple-db', { valueEncoding: 'binary' });
  var server = serve(db);

  addServer(db, server);
  var manifest = createManifest(db);

  var ns = net.createServer(function (stream) {
    stream.pipe(multilevel.server(db)).pipe(stream);
  })
  ns.listen(function () {
    var nport = ns.address().port;

    var hs = http.createServer(server.handle.bind(server));
    hs.listen(function () {
      cb(manifest, hs, ns, db);
    });
  });
}
