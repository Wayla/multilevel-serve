
# multilevel-serve

Expose a [level-serve](https://github.com/wayla/level-serve) instance over the
network by smuggling them into a db object, using multilevel as a transport
and the extracting them back again on the client.

[![build status](https://secure.travis-ci.org/Wayla/multilevel-serve.png)](http://travis-ci.org/Wayla/multilevel-serve)

## Usage

This assumes that you're already using
[multilevel](https://github.com/juliangruber/multilevel). For help setting it
up, there's a section about using plugins in its README.

Host a multilevel server on port 3000 and the `level-serve` http server on port
8000.

```js
var serve = require('level-serve');
var addServer = require('multilevel-serve');
var http = require('http');

var db = // initialize a database...

// create static file server and add it to the db
var server = serve(db);
addServer(db, server);

// write the manifest...
// expose multilevel over tcp...

// start listening on http port 8000
http.createServer(function (req, res) {
  server.handle(req, res);
}).listen(8000);
```

In the client, make the connection and then store a
[cat picture](https://github.com/maxogden/cats) in `level-serve` and get its
url.

```js
var getServer = require('multilevel-server');
var fs = require('fs');

// get the manifest from the server...
var db = // create a multilevel client from the manifest...
// connect it to the server...

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
```

## API

### Server

```js
var addServer = require('multilevel-serve');
```

#### addServer(db, server)

Smuggle the `server`'s methods into `db`.

### Client

```js
var getServer = require('multilevel-serve');
```

#### var server = getServer(db)

Get the `server` back from the `db` object.

## Installation

With [npm](http://npmjs.org) do

```bash
$ npm install  multilevel-serve
```

## License

(MIT)

Copyright (c) 2013 Wayla &lt;data@wayla.com&gt;

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
of the Software, and to permit persons to whom the Software is furnished to do
so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
