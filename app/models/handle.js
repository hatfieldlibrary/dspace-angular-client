'use strict';

var rp = require('request-promise');
var utils = require('../core/utils');


(function () {
  /**
   * Model for fetching via DSpace handle.  Uses REST API.
   */
  module.exports = function (site, item, session) {

    var dspaceTokenHeader = utils.getDspaceToken(session);
    var host = utils.getURL();
    var dspaceContext = utils.getDspaceAppContext();

    /** DSpace handle request-promise */
    var handleRequest =
      rp(
        {
          url: host + '/' + dspaceContext +  '/handle/' + site + '/' + item,
          method: 'GET',
          headers: {
            'User-Agent': 'Request-Promise',
            'Cookie': dspaceTokenHeader
          },
          json: true,
          rejectUnauthorized: utils.rejectUnauthorized()
        }, function (error, response, body) {
          if (dspaceTokenHeader.length === 0) {
            session = utils.setDspaceCookieInfo(response, session);
          }
        }
      );

    return handleRequest;

  };


})();
