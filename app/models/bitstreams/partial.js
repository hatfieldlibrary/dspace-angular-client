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

  module.exports = function (range, req, res, id, session, file) {

    /**
     * Reads file from the cache.
     * @param filePath
     * @private
     */
    function _readFile(filePath) {

      var size;

      fs.stat(filePath, function (err, stat) {
        if (err) {
          console.log('Cannot stat file: ' + err)
        }

        size = stat.size;
        _sendData(filePath, size);

      });

    }

    /**
     * Sends partial response to the client.  If the byte
     * range is incorrect, returns 416.  Otherwise, returns
     * 206 and the requested bytes.
     * @param filePath
     * @param size
     * @private
     */
    function _sendData(filePath, size) {

      var positions = range.replace(/bytes=/, "").split("-");

      var start = parseInt(positions[0], 10);
      var end = positions[1] ? parseInt(positions[1], 10) : size - 1;
      var chunkSize = (end - start) + 1;

      if (start >= size || end >= size) {
        // Indicate the acceptable range.
        // Return the 416 'Requested Range Not Satisfiable'.
        res.status(416);
        res.set("Content-Range", 'bytes */' + size);
        res.end();

      }
      else {

        res.set({
          'Content-Range': 'bytes ' + start + '-' + end + '/' + size,
          'Accept-Ranges': 'bytes',
          'Content-Length': chunkSize
        });

        res.status(206);

        var readStream = fs.createReadStream(filePath, {start: start, end: end});

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


    }


    /**
     * Retrieves bitstream from dspace and writes to
     * cache.  Upon completion, calls _readFile to return
     * response to client.
     * @param filePath
     * @private
     */
    function _getFileFromDspace(filePath) {

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

        var writeStream = fs.createWriteStream(filePath);

        writeStream.on('error', function (err) {
          console.log(err);
        });

        response.pipe(writeStream)

          .on('error', function (err) {  // done
            console.log("Error writing file to disk. " + err);
          })

          .on('finish', function () {
            console.log('File written to disk: ' + filePath);
            _readFile(filePath);

          });

      }).on('error', function (e) {
        // we got an error, return 500 error to client and log error
        console.log('Error retrieving file from Dspace. ' + e.message);
        res.end();
      });



    }

    /**
     * Loads content based on the file's availability
     * in the local cache.  If file exists, send data
     * to the client. If not, fetch it from dspace and add
     * it to the local cache.
     * @param err
     * @param stats
     * @private
     */
    function _loadContent(err, stats) {

      if (err !== null) {
        // File does not exist, so fetch from dspace.
        if (err.code === 'ENOENT') {
          console.log('Attempting to add file to local cache.');
          _getFileFromDspace(filePath);

        }
        else {
          console.log(err);
        }
      }

      else if (stats.isFile()) {
        // File exists, so use it.
        var size = stats.size;
        _sendData(filePath, size);
      }

    }

    // The request includes the cache directory location
    // defined in app config.
    var filePath = req.filePath;

    // Stat file on disk.
    var regex = /\s/g;
    var filePath = filePath + '/' + id + '-' + file.replace(regex, '_');

    fs.stat(filePath, _loadContent);

  }


})();