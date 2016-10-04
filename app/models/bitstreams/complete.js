/**
 * Created by mspalti on 9/29/16.
 */


var utils = require('../../core/utils');
var fs = require('fs');

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

  module.exports = function (req, res, id, session, file) {


    /**
     * Retrieves file from DSpace and streams response to client.
     * @private
     */
    function _getFileFromDspace() {

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

        try {

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
          res.write(chunk);

        });
        response.on('close', function () {
          // closed, let's end client request as well
          res.end();

        });
        response.on('end', function () {
          // finished.
          res.end();
        });


      });
    }


    /**
     * Retrieves the file from the local cache and streams response
     * to the client.  Files are added to the local cache in response
     * to byte range requests for video.
     * @param filePath
     * @param size
     * @private
     */
    function _sendCachedFile(filePath, size) {

      res.status(200);

      var extension = filePath.split('.').pop();

      var mimeType = utils.mimeType(extension);

      res.set({
        'Content-Length': size

      });
      res.type(mimeType);

      var readStream = fs.createReadStream(filePath);

      // write data chunk to res.
      readStream.on('data', function (chunk) {
        // Set to encode base64.
        res.write(chunk);

      });
      readStream.on('close', function () {
        // closed, let's end client request as well
        res.end();

      });
      readStream.on('end', function () {
        // finished, ending res.
        res.end();

      });


    }


    /**
     * Loads content based on the file's availability
     * in the local cache.  If file exists, stream data
     * from the local cache. Otherwise, request data from
     * DSpace and forward response to the client.
     * @param err
     * @param stats
     * @private
     */
    function _loadContent(err, stats) {

      if (err !== null) {
        // File does not exist, so fetch from dspace.
        if (err.code === 'ENOENT') {
          _getFileFromDspace();
        }
        else {
          console.log(err);
        }

      }

      else if (stats.isFile()) {
        // File exists, so use it.
        var size = stats.size;
        _sendCachedFile(filePath, size);
      }

    }

    // The request contains the cache directory location
    // defined in app config.
    var filePath = req.filePath;

    // try to stat file on disk.
    var regex = /\s/g;
    var filePath = filePath + '/' + id + '-' + file.replace(regex, '_');

    fs.stat(filePath, _loadContent);

  }


})();

