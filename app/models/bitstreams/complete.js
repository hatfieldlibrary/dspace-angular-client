/**
 * Created by mspalti on 9/29/16.
 */


var utils = require('../../core/utils');

if (utils.getDspaceRestProtocol() === 'https') {
  var http = require('https');
}
else {
  var http = require('http');
}

(function () {

  module.exports = function (req, res, id, session, file) {

    console.log('complete')


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

    console.log(host + port + '/' + dspaceContext + '/bitstreams/' + id)
    http.get(options, function (response) {

      var range = req.headers['range'];

      var mimeType = response.headers['content-type'];
      console.log(mimeType)

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



        res.status(200);
        res.set('Connection', 'keep-alive');
        res.set('Content-Type', mimeType);
        res.set('Transfer-Encoding', 'chunked');

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
      catch
        (err) {

        console.log(err);

      }

    });
  }


})();

