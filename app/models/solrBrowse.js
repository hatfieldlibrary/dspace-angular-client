/**
 * Created by mspalti on 3/3/16.
 */

'use strict';

var rp = require('request-promise');
var utils = require('./utils');

(function () {

  var processType = '';
  /**
   * Returns API response for handle.
   */
  module.exports = function (query, res, session) {

    console.log(query);

    var dspaceTokenHeader = utils.getDspaceToken(session);

    var solrUrl = utils.getSolrUrl(query);

    var solr =
      rp(
        {
          /** when not running on dspace host, use local port forwarding: e.g.: ssh -L 1234:127.0.0.1:8080 dspacehost.home.edu */
          //  url: host + '/solr/search/select?q=title:' + query + '&wt=json',
          url: solrUrl,
          method: 'GET',
          headers: {
            'User-Agent': 'Request-Promise',
            'rest-dspace-token': dspaceTokenHeader
          },
          json: true,
          transform: processResult
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


  function processResult(solrResponse ) {

      return utils.processItems(solrResponse);

  }


})();

