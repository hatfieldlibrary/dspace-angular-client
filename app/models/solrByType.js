'use strict';

var rp = require('request-promise');
var utils = require('../controllers/utils');

(function () {
  /**
   * Returns API response for handle.
   */
  module.exports = function (type, id, offset, res, session) {

    console.log('http://localhost:1234/solr/search/select?sort=dc.date.accessioned_dt+desc&start=' + offset + '&q=location.' + type + ':' + id + '&fl=dc.title,author,dc.publisher,dateIssued.year,handle,numFound&wt=json');

    var dspaceTokenHeader = utils.getDspaceToken(session);
    var host = utils.getURL();

    var solr =
      rp(
        {
          /** when not running on dspace host, use local port forwarding: e.g.: ssh -L 1234:127.0.0.1:8080 dspacehost.home.edu */
          //  url: host + '/solr/search/select?q=title:' + query + '&wt=json',
          url: 'http://localhost:1234/solr/search/select?sort=dc.date.accessioned_dt+desc&start=' + offset + '&q=location.' + type + ':' + id + '&fl=dc.title,author,dc.publisher,dateIssued.year,handle,search.resourceid,numFound&wt=json',
          method: 'GET',
          headers: {'User-Agent': 'Request-Promise',
            'rest-dspace-token': dspaceTokenHeader},
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

  function processResult(solrResponse) {

    var json = solrResponse.response.docs;

    var ret = {};
    var resultArr = [];

    // Some returned values are arrays.  Would
    // we ever expect the array to contain more
    // than one element?  If so, we need to return
    // the array and process it in the view. For now,
    // returning string from the first element in the
    // array.
    for (var i = 0; i < json.length; i++) {
      var tmp = {};
      if (json[i]['dc.title'] !== undefined) {
        tmp.title = json[i]['dc.title'][0];
      }
      if (json[i].author !== undefined) {
        tmp.author = json[i].author;
      }
      if (json[i]["dc.publisher"] !== undefined) {
        tmp.publisher = json[i]["dc.publisher"][0];
      }
      if (json[i]['dateIssued.year'] !== undefined) {
        tmp.year = json[i]['dateIssued.year'][0];
      }
      tmp.id = json[i]['search.resourceid'];
      tmp.handle = json[i].handle;
      resultArr[i] = tmp;
    }

    ret.results = resultArr;
    ret.count = solrResponse.response.numFound;
    return ret;
  }


})();
