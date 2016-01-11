'use strict';

var rp = require('request-promise');


(function () {

  module.exports = function (dspaceTokenHeader) {

    /** DSpace session status request-promise */
    var logoutRequest =
      rp(
        {
          url: 'http://localhost:8080/dspace5-rest/status',
          method: 'GET',
          headers: {
            'User-Agent': 'Request-Promise',
            'rest-dspace-token': dspaceTokenHeader
          },
          json: true
        }
      );

    return logoutRequest;

  };

})();
