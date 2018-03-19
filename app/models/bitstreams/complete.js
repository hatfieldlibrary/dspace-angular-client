(function () {

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

  module.exports = function (req, res, id, session, file) {

    // The request contains the cache directory location
    // defined in app config.
    var filePath = req.filePath;
    // try to stat file on disk.
    var regex = /\s/g;
    var filePath = filePath + '/' + id + '-' + file.replace(regex, '_');
    // Initiate request. Will use cached file if available, otherwise
    // request from DSpace.
    fs.stat(filePath, _loadContent);

    /**
     * Retrieves file from DSpace and streams response to client.
     * @private
     */
    function _getFileFromDspace() {

      var dspaceTokenHeader = utils.getDspaceToken(session);
      var host = utils.getHost();
      var port = utils.getPort();
      var dspaceContext = utils.getDspaceAppContext();

      res.set({
        'Transfer-Encoding': 'chunked'

      });

      var options = {
        host: host,
        port: port,
        path: '/' + dspaceContext + '/bitstreams/' + id + '/retrieve',
        method: 'GET',
        headers: {
          'Cookie': dspaceTokenHeader
        },
        rejectUnauthorized: utils.rejectUnauthorized()
      };

      http.get(options, function (stream) {

        try {

          var mimeType = stream.headers['content-type'];

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
        stream.on('data', function (chunk) {
          res.write(chunk);
        });
        stream.on('close', function () {
          // closed, let's end client request as well
          res.end();
        });
        stream.on('error', function(err) {
          console.log(err);
          res.statusCode = 500;
          res.end();
        });
        stream.on('end', function () {
          // finished reading data.
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
      res.type(mimeType);
      res.set({
        'Transfer-Encoding': 'chunked'
      });

      var readStream = fs.createReadStream(filePath);

      // write data chunk to res.
      readStream.on('data', function (chunk) {
        // Set to encode base64.
        res.write(chunk);
      });
      readStream.on('error', function(err) {
        console.log(err);
        res.statusCode = 500;
        res.end();
      });
      readStream.on('close', function () {
        // closed, lets end client request as well
        res.end();
      });
      readStream.on('end', function () {
        // End of data. This event precedes the close event.
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

  }

})();

