/**
 * Created by mspalti on 2/23/16.
 */

'use strict';

var rp = require('request-promise');

(function () {
  /**
   * Returns API response for handle.
   */
  module.exports = function (type, id, res) {

    console.log('http://localhost:1234/solr/search/select?sort=dc.date.accessioned_dt+desc&q=location.' + type + ':' + id + '&fl=dc.title,author,dc.publisher,dateIssued.year,handle&wt=json');

    var solr =
      rp(
        {
          /** when not running on dspace host, use local port forwarding: e.g.: ssh -L 1234:127.0.0.1:8080 dspacehost.home.edu */
          //  url: host + '/solr/search/select?q=title:' + query + '&wt=json',
          url: 'http://localhost:1234/solr/search/select?sort=dc.date.accessioned_dt+desc&rows=5&q=location.' + type + ':' + id + '&fl=dc.title,dateIssued.year,handle&wt=json',
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

