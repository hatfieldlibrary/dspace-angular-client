'use strict';

var rp = require('request-promise');

(function () {
  /**
   * Model for fetching the DSpace API handle response.
   */
  module.exports = function (site, item) {

    var handleRequest =
      rp(
        {
          url: 'http://localhost:6789/rest/handle/' + site + '/' + item,
          method: 'GET',
          headers: {'User-Agent': 'Request-Promise',
            'rest-dspace-token:': '6a641ba1-53bb-49a0-9dfb-24d9d8b0a87a'},
          json: true
        }
      ).then(function (json) {
        console.log(json);
          return json;
        })
        .catch(function (err) {
          console.log(err);
        });

    return handleRequest;

  };


})();
