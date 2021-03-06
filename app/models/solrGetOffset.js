/**
 * Created by mspalti on 3/25/16.
 */
'use strict';

var rp = require('request-promise');
var utils = require('../core/utils');
var queryGenerator = require('../core/queryGenerator');

(function () {

  /**
   * Returns API response for handle.
   */
  module.exports = function (query, res, session) {

    var dspaceTokenHeader = utils.getDspaceToken(session);


    /**
     * Get the solr URL.
     * @type {string}
     */
    var solrUrl = queryGenerator.getOffsetUrl(query, dspaceTokenHeader);

    /**
     * The request-promise.
     */
    var solr =
      rp(
        {
          url: solrUrl,
          method: 'GET',
          headers: {
            'User-Agent': 'Request-Promise',
            'Cookie': dspaceTokenHeader
          },
          json: true,
          rejectUnauthorized: utils.rejectUnauthorized(),
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

    if (solrResponse.response.numFound > 0) {
      return {offset: solrResponse.response.numFound - 1};
    }
    return {offset: 0};


  }


})();
