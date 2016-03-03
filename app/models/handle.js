'use strict';

var rp = require('request-promise');
var utils = require('./utils');


(function () {
  /**
   * Model for fetching via DSpace handle.
   */
  module.exports = function (site, item, session) {

    console.log(session);

    var dspaceTokenHeader = utils.getDspaceToken(session);
    var host = utils.getURL();

    console.log('handle token ' + dspaceTokenHeader);
    console.log('url is ' + host + '/rest/handle/' + site + '/' + item);

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
