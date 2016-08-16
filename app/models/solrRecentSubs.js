/**
 *  currently unused.
 */

'use strict';

var rp = require('request-promise');

(function () {
  /**
   * Returns API response for handle.
   */
  module.exports = function (type, id, res) {

    var solr =
      rp(
        {
          url: 'http://localhost:1234/solr/search/select?sort=dc.date.accessioned_dt+desc&rows=5&q=location.' + type + ':' + id + '&fl=dc.title,dateIssued.year,handle&wt=json',
          method: 'GET',
          headers: {'User-Agent': 'Request-Promise'},
          json: true,
          rejectUnauthorized: utils.rejectUnauthorized()
        }
      ).then(function (json) {
          res.send(json);
          res.end();
        })
        .catch(function (err) {
          console.log(err);
        });

    return solr;

  };


})();

