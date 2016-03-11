'use strict';

var rp = require('request-promise');
var utils = require('./utils');
var constants = require('./constants');

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
    if (query.params.query.type.length > 0) {
      processType = query.params.query.type;
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


    if (processType === constants.QueryType.AUTHOR_FACETS  ) {
      return utils.processAuthor(solrResponse);

    } else if (processType === constants.QueryType.SUBJECT_FACETS)   {
      return utils.processSubject(solrResponse);
    }
    else
     {
      return utils.processItems(solrResponse);

    }
  }


})();
