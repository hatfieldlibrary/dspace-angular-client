'use strict';

var utils = require('../core/utils');
var partialContent = require('./bitstreams/partial');
var completeContent = require('./bitstreams/complete');


if (utils.getDspaceRestProtocol() === 'https') {
  var http = require('https');
}
else {
  var http = require('http');
}

/**
 * Requests a bitstream from the DSpace host via REST API and
 * writes to the Express response stream using base64 encoding.
 *
 * The proxyed request includes the dspace REST token if one is
 * provided. This allows access to restricted bitstreams.  Currently,
 * the other advantage to this approach is the ability to support
 * Content-Partial requests for video, something dspace itself does
 * not currently support.
 *
 * NOTE: Uses the http module. For communicating with the REST API over
 * SSL, you need the https module. Also add 'rejectUnauthorized: false' to
 * the options.
 */
(function () {

  module.exports = function (req, res, id, session, file, size) {




    var range = req.headers['range'];

    // video and audio extensions.
    var mimeNames = {
      'mp3': 'audio/mpeg',
      'mp4': 'video/mp4',
      'mov': 'video/mov',
      'ogv': 'video/ogg',
      'oga': 'audio/ogg',
      'wav': 'audio/x-wav',
      'webm': 'video/webm'
    };

    try {

      var fileParts = file.split('\.');

      // A range request
      if (range) {

        partialContent(range, req, res, id, session, file, size);

      }

      else {

        // In the case of video/audio requests, Safari will request and use
        // partial content ranges.  This means we should ignore the initial
        // download request and wait for the follow up requests with ranges.
        var regex = '/safari/i';

        if (req.headers['user-agent'].match(regex)) {
          // Only request here if the file is not video or audio.
          if (!fileParts[1] in mimeNames) {
            completeContent(req, res, id, session, file);
          }
        }

        // All other browsers.
          else {
            completeContent(req, res, id, session, file);

          }

      }

    } catch (err) {

      console.log(err);

    }

  //   function getItemStats(mimeType) {
  //
  //     var dspaceTokenHeader = utils.getDspaceToken(session);
  //     var host = utils.getHost();
  //     var port = utils.getPort();
  //     var dspaceContext = utils.getDspaceAppContext();
  //
  //     console.log(dspaceTokenHeader)
  //     var options = {
  //       host: host,
  //       port: port,
  //       path: '/' + dspaceContext + '/bitstreams/' + id,
  //       method: 'GET',
  //       headers: {
  //         'rest-dspace-token': dspaceTokenHeader,
  //         'Accept': 'application/json'
  //       },
  //       rejectUnauthorized: utils.rejectUnauthorized()
  //     };
  //
  //     http.get(options, function (response) {
  //
  //       var body = '';
  //
  //       response.on('data', function (data) {
  //
  //         body += data;
  //
  //       });
  //
  //       response.on('end', function () {
  //         var jsonObject = JSON.parse(body);
  //         console.log(jsonObject)
  //         var fileSize = jsonObject.sizeBytes;
  //         var end = fileSize - 1;
  //         console.log('file size: ' + fileSize)
  //         // if (typeof positions[1] === 'undefined') {
  //         res.status(206);
  //         res.set('Content-Range', 'bytes=0-' + end + '/' + fileSize);
  //         res.set('Accept-Ranges', 'bytes');
  //         res.set('Content-Length', fileSize);
  //         res.set('Content-Type', mimeType);
  //         res.end();
  //       })
  //
  //     }).on('error', function(e){
  //       console.log("Got an error: ", e);
  //     });;
  //   }
  //

   };


})();
