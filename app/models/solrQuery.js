'use strict';

var rp = require('request-promise');
var queryGenerator = require('../core/queryGenerator');
var utils = require('../core/utils');
var processors = require('../core/responseProcessor');
var constants = require('../core/constants');

(function () {

  var processType = '';

  /**
   * Method that handles the request-promise transform.
   *
   * @param solrResponse  the response form the solr query
   * @returns {{}}
   */
  function processResult(solrResponse) {

    if (processType === constants.QueryType.AUTHOR_FACETS) {
      return processors.processAuthor(solrResponse);

    }
    else if (processType === constants.QueryType.SUBJECT_FACETS) {
      return processors.processSubject(solrResponse);

    }
    else if (processType === constants.QueryType.DISCOVER) {
      return processors.processDiscoveryResult(solrResponse);

    }
    else {
      return processors.processItems(solrResponse);

    }
  }

  /**
   * Returns API response for handle.
   */
  module.exports = function (query, res, session) {

    var dspaceTokenHeader = utils.getDspaceToken(session);

    /**
     * Setting the processType. This allows us to distinguish requests
     * to sort an author list from other requests for items (more typical).
     */
   // if (query.params.query.qType) {
      if (query.params.query.qType.length > 0) {
        processType = query.params.query.qType;
      }
  //  }

    /**
     * Get the solr URL.
     * @type {string}
     */
    var solrUrl = queryGenerator.getSolrUrl(query, dspaceTokenHeader);

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





})();
