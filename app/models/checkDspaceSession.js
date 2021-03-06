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
          url: host + '/' + dspaceContext + '/status',
          method: 'GET',
          headers: {
            'User-Agent': 'Request-Promise',
            'Cookie': dspaceTokenHeader
          },
          json: true,
          rejectUnauthorized: utils.rejectUnauthorized()
        }
      );

    return sessionStatus;
  };

})();
