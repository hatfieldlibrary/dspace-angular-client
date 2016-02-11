'use strict';

var utils = require('../controllers/utils');
var http = require('http');

/**
 * Requests bitstream from the DSpace host and
 * writes to the Express response stream using base64.
 */
(function () {

  module.exports = function (req, res, id, session) {

    var dspaceTokenHeader = utils.getDspaceToken(session);
    var host = utils.getHost();
    var port = utils.getPort();

     var options = {
       host: host,
         port: port,
         path: '/rest/bitstreams/' + id + '/retrieve',
         method: 'GET',
         headers: {
           'rest-dspace-token': dspaceTokenHeader
         }
     };

     http.get(options, function(response) {

       // get the content type and set res header.
       res.type(response.headers['content-type']);

       // write data chunk to res.
       response.on('data', function(chunk) {
         // Set to encode base64.
         res.write( chunk, 'base64');
     });
       response.on('end', function() {
         // finished, ending res.
         res.end();
       });

     });

  }
})();
