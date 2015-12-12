'use strict';

var rp = require('request-promise');

(function () {
  /**
   * Returns API response for handle.
   */
  module.exports = function (query, res) {
    //add query type (eg author)

    var solr =
      rp(
        {
          url: 'http://localhost:1234/solr/search/select?q=title:' + query + '&wt=json',
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

    return solr;

  };


})();
