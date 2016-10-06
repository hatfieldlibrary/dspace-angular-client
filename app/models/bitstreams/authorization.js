/**
 * Checks whether user is authorized to access the bitstream.
 * Returns 401 if access is denied.  This check is necessary
 * because media files have been cached on this server and are
 * accessed directly without requesting again from DSpace.
 *
 * Created by mspalti on 10/5/16.
 */

var utils = require('../../core/utils');

// Use either http or https as specified in the app
// config. If using https and a self-signed certificate,
// set rejectUnauthorized to false in the app config.
if (utils.getDspaceRestProtocol() === 'https') {
  var http = require('https');
}
else {
  var http = require('http');
}

(function () {

  module.exports = function (req, res, id, session, callback) {

      var dspaceTokenHeader = utils.getDspaceToken(session);
      var host = utils.getHost();
      var port = utils.getPort();
      var dspaceContext = utils.getDspaceAppContext();

      var options = {
        host: host,
        port: port,
        path: '/' + dspaceContext + '/bitstreams/' + id,
        method: 'GET',
        headers: {
          'rest-dspace-token': dspaceTokenHeader
        },
        rejectUnauthorized: utils.rejectUnauthorized()
      };

      http.get(options, function (response) {

        if (response.statusCode === 401) {

          res.status(401);
          res.end();

        } else {

          callback();

        }

      }).on('error', function (e) {
        // we got an error, return 500 error to client and log error
        console.log('Error retrieving file from Dspace. ' + e.message);
        res.end();
      });
    }

})();

