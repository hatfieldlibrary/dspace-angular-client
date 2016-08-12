/**
 * Created by mspalti on 5/12/16.
 */
'use strict';

var rp = require('request-promise');
var utils = require('../core/utils');


(function () {

  module.exports = function (dspaceTokenHeader) {

    var host = utils.getURL();
    var dspaceContext = utils.getDspaceAppContext();

    /** DSpace session status request-promise */
    var sessionStatus =
      rp(
        {
          url: host + '/' + dspaceContext + '/adminStatus',
          method: 'GET',
          headers: {
            'User-Agent': 'Request-Promise',
            'rest-dspace-token': dspaceTokenHeader
          },
          json: true,
          rejectUnauthorized: false
        }
      );

    return sessionStatus;

  };

})();
