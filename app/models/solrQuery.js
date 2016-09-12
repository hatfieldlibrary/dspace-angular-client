'use strict';

var rp = require('request-promise');
var queryGenerator = require('../core/queryGenerator');
var utils = require('../core/utils');
var processors = require('../core/responseProcessor');
var constants = require('../core/constants');

(function () {

  var processType = '';

  /**
   * Callback method for the request-promise transform.
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

    try {
      if (query.params.query.qType.length > 0) {
        processType = query.params.query.qType;
      }
    } catch (err) {
      console.log('ERROR: Missing query type.');
      console.log(err);
    }


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
          rejectUnauthorized: utils.rejectUnauthorized(),
          transform: processResult
        }
      ).then(function (json) {

        if (json.results.length === 0) {
          res.status(404);
          res.send(json);
          res.end();
        } else {
          res.send(json);
          res.end();
        }
        })
        .catch(function (err) {
          console.log(err);
        });

    return solr;

  };





})();
