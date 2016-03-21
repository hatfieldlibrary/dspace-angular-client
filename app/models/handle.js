'use strict';

var rp = require('request-promise');
var utils = require('../core/utils');


(function () {
  /**
   * Model for fetching via DSpace handle.  Uses REST API.
   */
  module.exports = function (site, item, session) {

    console.log(session);

    var dspaceTokenHeader = utils.getDspaceToken(session);
    var host = utils.getURL();

    /** DSpace handle request-promise */
    var handleRequest =
      rp(
        {
          url: host + '/rest/handle/' + site + '/' + item,
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
