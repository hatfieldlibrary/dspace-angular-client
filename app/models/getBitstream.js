'use strict';

var utils = require('../core/utils');
var http = require('http');

/**
 * Requests bitstream from the DSpace host via REST API and
 * writes to the Express response stream using base64 encoding.
 */
(function () {

  module.exports = function (req, res, id, session) {

    var dspaceTokenHeader = utils.getDspaceToken(session);
    var host = utils.getHost();
    var port = utils.getPort();
    var dspaceContext = utils.getDspaceAppContext();

    var options = {
      host: host,
      port: port,
      path: '/' + dspaceContext + '/bitstreams/' + id + '/retrieve',
      method: 'GET',
      headers: {
        'rest-dspace-token': dspaceTokenHeader
      }
    };

    http.get(options, function (response) {

      var mimeType;

      try {
        /**
         *  Get the content type of the stream return by DSpace
         *  and set Express response header.
         */
        mimeType = res.type(response.headers['content-type']);

      } catch (err) {
        console.log(err);

      }

      // write data chunk to res.
      response.on('data', function (chunk) {

        if (mimeType === 'text/plain') {
          res.write(chunk, 'utf8');
        } else {
          // Set to encode base64.
          res.write(chunk, 'base64');
        }

      });

      response.on('end', function () {
        // finished, ending res.
        res.end();
      });

    });

  }
})();
