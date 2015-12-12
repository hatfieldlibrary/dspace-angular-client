'use strict';

var rp = require('request-promise');

(function () {
  /**
   * Returns API response for handle.
   */
  module.exports = function (site, item, res) {

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
          res.send(json);
          res.end();
        })
        .catch(function (err) {
          console.log(err);
        });

    return handleRequest;

  };


})();
