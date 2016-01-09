'use strict';

var rp = require('request-promise');
var utils = require('./utils');

(function () {
  /**
   * Model for fetching via DSpace handle.
   */
  module.exports = function (site, item, session) {

    var dspaceTokenHeader = utils.dspaceToken(session);

    /** DSpace handle request-promise */
    var handleRequest =
      rp(
        {
          url: 'http://localhost:8080/dspace5-rest/handle/' + site + '/' + item,
          method: 'GET',
          headers: {
            'User-Agent': 'Request-Promise',
            'rest-dspace-token': dspaceTokenHeader
          },
          json: true
        }
      );

    return handleRequest;

  };


})();
