/**
 * Created by mspalti on 2/25/16.
 */
'use strict';

var rp = require('request-promise');
var utils = require('../core/utils');

(function () {
  /**
   * Model for retrieving the communities list via the REST API.
   */
  module.exports = function (session) {

    var dspaceTokenHeader = utils.getDspaceToken(session);
    var host = utils.getURL();
    var dspaceContext = utils.getDspaceAppContext();

    var list =
      rp(
        {
          url: host + '/' + dspaceContext  +  '/communities',
          method: 'GET',
          headers: {
            'User-Agent': 'Request-Promise',
            'rest-dspace-token': dspaceTokenHeader
          },
          json: true,
          rejectUnauthorized: utils.rejectUnauthorized()

        }
      );

    return list;

  };


})();
