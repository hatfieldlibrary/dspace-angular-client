'use strict';

var utils = require('../core/utils');
var http = require('http');
var request = require('request');

/**
 * Requests a bitstream from the DSpace host via REST API and
 * writes to the Express response stream using base64 encoding.
 * The proxy request includes the dspace REST token is one is
 * provided. This allows access to restricted bitstreams.
 *
 * This proxy does no additional work. The only additional benefit 
 * is that we consolidate all requests to this host/port.  Alternatively,
 * the browser client could be configured to request bitstream
 * data directly from the DSpace REST servlet -- if authentication
 * is not an issue.
 */
(function () {

  module.exports = function (req, res, id, session, file) {

    /**
     * When an actual file name and extension are provided, this
     * could be used to set mime type. Currently, returning
     * application/octetstream.
     */

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

    // var options = {
    //   url: 'http://' + host + ':' + port + '/' + dspaceContext + '/bitstreams/' + id + '/retrieve',
    //   // port: port,
    //   // path: '/' + dspaceContext + '/bitstreams/' + id + '/retrieve',
    //   // method: 'GET',
    //   headers: {
    //     'rest-dspace-token': dspaceTokenHeader
    //   }
    // };
    // request(options).pipe(res);

    http.get(options, function (response) {

      /**
       * Setting the response header. 
       */
      try {
        /**
         *  Get the content type returned by DSpace.
         *  Will be application/octetstream
         */
        var mimeType = response.headers['content-type'];
        /**
         * Internet Explorer resists displaying images without a proper 
         * mime type. This fix, which is hopefully temporary, assumes 
         * the mime type for logos will be image/jpg.
         */
        if (file === 'logo') {
          res.type('jpg');
        } else {
          res.type(mimeType);
        }

      } catch (err) {
        console.log(err);
      }

      // write data chunk to res.
      response.on('data', function (chunk) {
        // Set to encode base64.
        res.write(chunk, 'base64');

      });
      response.on('close', function () {
        // closed, let's end client request as well
        res.end();

      });
      response.on('end', function () {
        // finished, ending res.
        res.end();

      });

    }).on('error', function (e) {
      // we got an error, return 500 error to client and log error
      console.log(e.message);
      res.end();
    });

  }
})();
