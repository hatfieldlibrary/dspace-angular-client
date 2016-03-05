'use strict';

var rp = require('request-promise');
var utils = require('./utils');

(function () {

  var processType = '';
  /**
   * Returns API response for handle.
   */
  module.exports = function (query, res, session) {

    var dspaceTokenHeader = utils.getDspaceToken(session);

    /**
     * Setting the processType. This allows us to distinguish requests
     * to sort an author list from other requests for items (more typical).
     */
    if (query.params.sort.field.length > 0) {
      processType = query.params.sort.field;
    }

    /**
     * Get the solr URL.
     * @type {string}
       */
    var solrUrl = utils.getSolrUrl(query);

    /**
     * The request-promise.
     */
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


  /**
   * Method that handles the request-promise transform.
   *
   * @param solrResponse  the response form the solr query
   * @returns {{}}
     */
  function processResult(solrResponse ) {

    if (processType === 'bi_2_dis_filter') {
      return utils.processAuthor(solrResponse);

    } else {
      return utils.processItems(solrResponse);

    }
  }


})();
