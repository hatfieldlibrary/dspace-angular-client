'use strict';

var rp = require('request-promise');


(function () {

  module.exports = function (dspaceTokenHeader) {

    console.log('check dspace session with token ' + dspaceTokenHeader);

    /** DSpace session status request-promise */
    var logoutRequest =
      rp(
        {
          url: 'http://dspace.willamette.edu:8080/rest/status',
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
