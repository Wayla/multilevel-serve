module.exports = function (db, server) {
  return server
    ? addServer(db, server)
    : getServer(db);
};

function getServer (db) {
  var server = Object.keys(db)
    .filter(function (name) {
      return /^__serve__/.test(name);
    })
    .map(function (prefixed) {
      return {
        prefixed: prefixed,
        unprefixed: prefixed.replace(/^__serve__/, '')
      }
    })
    .reduce(function (server, name) {
      server[name.unprefixed] = db[name.prefixed].bind(db);
      return server;
    }, {});

  return server;
}

function addServer (db, server) {
  db.methods = db.methods || {};

  db.methods.__serve__handle = { type: 'sync' };
  db.__serve__handle = server.handle.bind(server);

  db.methods.__serve__createWriteStream = { type: 'writable' };
  db.__serve__createWriteStream = server.createWriteStream.bind(server);

  db.methods.__serve__store = { type: 'async' };
  db.__serve__store = server.store.bind(server);

  db.methods.__serve__url = { type: 'sync' };
  db.__serve__url = server.url.bind(server);

  return db;
}

/**
 * Take this from example/manifest.json.
 */

module.exports.manifest = {
  "methods": {
    "createReadStream": { "type": "readable" },
    "readStream": { "type": "readable" },
    "createValueStream": { "type": "readable" },
    "valueStream": { "type": "readable" },
    "createKeyStream": { "type": "readable" },
    "keyStream": { "type": "readable" },
    "createWriteStream": { "type": "writable" },
    "writeStream": { "type": "writable" },
    "isOpen": { "type": "sync" },
    "isClosed": { "type": "sync" },
    "put": { "type": "async" },
    "get": { "type": "async" },
    "del": { "type": "async" },
    "batch": { "type": "async" },
    "approximateSize": { "type": "async" },
    "__serve__handle": { "type": "sync" },
    "__serve__createWriteStream": { "type": "writable" },
    "__serve__store": { "type": "async" },
    "__serve__url": { "type": "sync" }
  }
};
