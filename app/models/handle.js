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
          url: 'http://localhost:1234/rest/handle/' + site + '/' + item,
          method: 'GET',
          headers: {'User-Agent': 'Request-Promise'},
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
