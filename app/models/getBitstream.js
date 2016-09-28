'use strict';

var utils = require('../core/utils');

if (utils.getDspaceRestProtocol() === 'https') {
  var http = require('https');
}
else {
  var http = require('http');
}

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
 *
 * NOTE: Uses the http module. For communicating with the REST API over
 * SSL, you need the https module. Also add 'rejectUnauthorized: false' to
 * the options.
 */
(function () {

  module.exports = function (req, res, id, session, file, size) {


    var range = req.headers['range'];

    try {


      console.log(range)

      if (range) {



        var positions = range.replace(/bytes=/, "").split("-");
        var start = parseInt(positions[0], 10);
        var end = positions[1] ? parseInt(positions[1], 10) : size - 1;
        var chunkSize = (end - start) + 1;

        if (chunkSize === 2) {

          console.log(chunkSize)

          console.log('got a range ' + 'bytes ' + start + '-' + end + '/' + size)

          res.status(206);
          res.set({
            'Content-Range': 'bytes ' + start + '-' + end + '/' + size,
            'Accept-Ranges': 'bytes',
            'Content-Length': size
          });

          res.send('1');
         // res.end();

        }

        else {


          console.log('getting the big chunk')

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
            },
            rejectUnauthorized: utils.rejectUnauthorized()
          };

          http.get(options, function (response) {

              console.log('/' + dspaceContext + '/bitstreams/' + id + '/retrieve')

              console.log(req.headers)


              var range = req.headers['range'];

              var mimeType = response.headers['content-type'];
              console.log('mime type: ' + mimeType);

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



            /**
               * Setting the response header.
               */
              try {

                if (start >= size || end >= size) {
                  console.log('not available')
                  // Indicate the acceptable range.
                  // res.set('Content-Range', 'bytes */' + size); // File size.

                  // Return the 416 'Requested Range Not Satisfiable'.
                  res.status(416);
                  res.set("Content-Range", 'bytes */' + size);
                  res.end();
                  // return null;
                }


                res.status(206);
                res.set('Connection', 'keep-alive');
                res.set('Content-Range', 'bytes 0-' + end + '/' + size);
                res.set('Accept-Ranges', 'bytes');
                res.set('Content-Length', size);
                res.set('Content-Type', mimeType);

                sendData(file, mimeType, res, response);

              }
              catch
                (err) {

                console.log(err);

              }


            }
          ).on('error', function (e) {
            // we got an error, return 500 error to client and log error
            console.log(e.message);
            res.end();
          });

        }
      }
      else {


        console.log('getting full video')
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
          },
          rejectUnauthorized: utils.rejectUnauthorized()
        };

        http.get(options, function (response) {

          console.log('/' + dspaceContext + '/bitstreams/' + id + '/retrieve')

          console.log(req.headers)


          var range = req.headers['range'];

          var mimeType = response.headers['content-type'];
          console.log('mime type: ' + mimeType);
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


          /**
           * Setting the response header.
           */
          try {

            if (start >= size || end >= size) {
              console.log('not available')
              // Indicate the acceptable range.
              // res.set('Content-Range', 'bytes */' + size); // File size.

              // Return the 416 'Requested Range Not Satisfiable'.
              res.status(416);
              res.set("Content-Range", 'bytes */' + size);
              res.end();
              // return null;
            }


            res.status(206);
            res.set('Connection', 'keep-alive');
            res.set('Content-Range', 'bytes ' + start + '-' + end + '/' + size);
            res.set('Accept-Ranges', 'bytes');
            res.set('Content-Length', chunkSize);
            res.set('Content-Type', mimeType);

            sendData(file, mimeType, res, response);

          }
          catch
            (err) {

            console.log(err);

          }
        });
      }
    } catch
      (err) {

      console.log(err);

    }
  };

  function sendData(file, mimeType, res, response) {




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
  }

})();
