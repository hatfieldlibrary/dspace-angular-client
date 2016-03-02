'use strict';

var rp = require('request-promise');
var utils = require('../controllers/utils');
var solrUtils = require('./utils');

(function () {

  var returnAuthors = false;

  var processType = '';
  /**
   * Returns API response for handle.
   */
  module.exports = function (query, res, session) {

    console.log(query);

    var dspaceTokenHeader = utils.getDspaceToken(session);

    returnAuthors = query.params.returnAuthors;

    if (query.params.sort.field.length > 0) {
      processType = query.params.sort.field;
    }

    var solrUrl = solrUtils.getSolrUrl(query);

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

    if (processType === 'bi_2_dis_filter') {
      return solrUtils.processAuthor(solrResponse, returnAuthors);

    } else {
      return solrUtils.processTitleDate(solrResponse);

    }
  }


})();
