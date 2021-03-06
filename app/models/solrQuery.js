'use strict';

var rp = require('request-promise');
var queryGenerator = require('../core/queryGenerator');
var utils = require('../core/utils');
var processors = require('../core/responseProcessor');


(function () {

  var processType = '';

  /**
   * Callback method for the request-promise transform.
   *
   * @param solrResponse  the response form the solr query
   * @returns {{}}
   */
  function processResult(solrResponse) {
    return processors.processResult(processType, solrResponse);

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
    console.log(solrUrl)
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
      ).then(function (json) {
        // This warrants a bit of review!  We need
        // to check for an empty results array and
        // return 404 if empty.  However, the facets
        // array can also be a return value, and it
        // looks like solr returns facets and an empty
        // results array.
        if (json.results) {
          if (json.results.length === 0) {
            res.status(404);
            res.send(json);
            res.end();
          } else {
            res.send(json);
            res.end();
          }
        }
        else if (json.facets) {
          if (json.facets.length === 0) {
            res.status(404);
            res.send(json);
            res.end();
          } else {
            res.send(json);
            res.end();
          }
        }
        else {
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
