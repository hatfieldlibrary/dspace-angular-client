/**
 * Created by mspalti on 3/25/16.
 */
'use strict';

var rp = require('request-promise');
var utils = require('../core/utils');

(function () {
  
  /**
   * Returns API response for handle.
   */
  module.exports = function (query, res, session) {

    var dspaceTokenHeader = utils.getDspaceToken(session);

    console.log('jump to');
    console.log(query);

    /**
     * Get the solr URL.
     * @type {string}
     */
    var solrUrl = utils.getOffsetUrl(query, dspaceTokenHeader);

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
      );

    return solr;

  };


  /**
   * Method that handles the request-promise transform.
   *
   * @param solrResponse  the response form the solr query
   * @returns {{}}
   */
  function processResult(solrResponse) {
   
    
    return {offset: solrResponse.response.numFound};
          
    
    
  }


})();
