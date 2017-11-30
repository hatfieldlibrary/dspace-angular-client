
(function () {

  'use strict';

  var partialContent = require('./bitstreams/partial');
  var completeContent = require('./bitstreams/complete');
  var checkAuthorization = require('./bitstreams/authorization');

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

  module.exports = function (req, res, id, session, file, size) {

    // we need to check for range request.
    var range = req.headers['range'];

    function _fetchBitstream() {

      // A range request.
      if (range && range) {
        partialContent(range, req, res, id, session, file, size);
      }

      else {
        completeContent(req, res, id, session, file);
      }
    }

    // Check authorization before handing bitstream request.
    checkAuthorization(req, res, id, session, _fetchBitstream);

  };

})();
