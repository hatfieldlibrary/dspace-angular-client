'use strict';

var utils = require('../controllers/utils');
var request = require('request');
var http = require('http');


(function () {

  module.exports = function (req, res, id, session) {

    var dspaceTokenHeader = utils.getDspaceToken(session);
    var host = utils.getHost();
    var port = utils.getPort();

    //  It would be great to pipe to result to the response stream. But
    //  I haven't learned how to get the res object to use base64 rather
    //  than default utf-8 encoding.  The alternative approach (below)
    //  loads a complete copy of the data into memory before sending.
    //
    // var options = {
    //   url: 'http://dspace.willamette.edu:8080/rest/bitstreams/' + id + '/retrieve',
    //   headers: {
    //     'rest-dspace-token': dspaceTokenHeader
    //   },
    //   encoding: 'base64'
    // };
    // // For this to work, the res object needs to encode base64.
    // request.get(options).pipe(res);
    //

    // Non-streaming solution.
    // Load the data chunks into buffer and call res.end with
    // base64 encoding.

    var options = {
      host: host,
      port: port,
      path: '/rest/bitstreams/' + id + '/retrieve',
      method: 'GET',
      headers: {
        'rest-dspace-token': dspaceTokenHeader
      }
    };

    http.get(options, function (response) {

      var chunks = [];

      response.on('data', function (chunk) {

        chunks.push(chunk);

      });

      response.on("end", function () {

        var data = new Buffer.concat(chunks);
        res.header('content-type', response.headers['content-type']);

        // use base64 encoding for transport
        res.end(data, 'base64');

      });

    }).on("error", function (e) {

        console.log(e.message);

    });

  }
})();
