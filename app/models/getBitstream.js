'use strict';

var partialContent = require('./bitstreams/partial');
var completeContent = require('./bitstreams/complete');
var utils = require('../core/utils');

/**
 * Requests a bitstream from the DSpace host via REST API and
 * writes to the Express response stream using base64 encoding.
 *
 * The proxied request includes the dspace REST token if one is
 * provided. This allows access to restricted bitstreams.
 *
 * The partial content module supports Content-Partial requests f
 * or video, something that dspace does not do currently.
 */
(function () {

  module.exports = function (req, res, id, session, file, size) {

    // we need to check for range request.
    var range = req.headers['range'];

    try {

      var fileParts = file.split('\.');

      // A range request.
      if (range) {

        partialContent(range, req, res, id, session, file, size);

      }

      else {

        // In the case of video/audio requests, Chrome/Safari will request and use
        // partial content ranges.  This means we should ignore the initial
        // download request and wait for the follow up requests with ranges.
        // This condition may change with changes to how video is requested in
        // the client. Currently, an anchor link is used, not embedded video
        // elements.
        var regex = '/safari|chrome/i';

        if (req.headers['user-agent'].match(regex)) {

          if (utils.isMediaExtension(fileParts[1])) {
            // non-media files for chrome/safari.
            completeContent(req, res, id, session, file);
          }

        }

        // All files for other browsers.
        else {

          completeContent(req, res, id, session, file);

        }

      }

    } catch (err) {

      console.log(err);

    }

  };

})();
