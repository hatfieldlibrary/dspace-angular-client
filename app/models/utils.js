/**
 * Created by mspalti on 3/1/16.
 */

'use strict';

var utils = require('../controllers/utils');

(function () {


  exports.getSolrUrl = function(query) {

    var field = '';
    var order = 'asc';
    var solrUrl = '';
    var rows = 10;

    // in practice, this may not be needed since this app will run on dspace host.
    var host = utils.getURL();

    if (query.params.sort.field.length > 0) {
      field = query.params.sort.field;
    }

    if (query.params.sort.order.length > 0) {
      order = query.params.sort.order;
    }


    if (query.params.query.action === 'list' && field.length > 0) {

      if (field === 'bi_2_dis_filter') {
        solrUrl = 'http://localhost:1234/solr/search/select?facet=true&facet.mincount=1&facet.offset=' + query.offset + '&rows=' + rows + '&f.bi_2_dis_filter.facet.sort=index&fl=handle,search.resourcetype,search.resourceid&start=' + query.offset + '&f.bi_2_dis_filter.facet.limit=-1&q=*:*&facet.field=bi_2_dis_filter&fq=NOT(withdrawn:true)&fq=NOT(discoverable:false)&fq=location.' + query.params.asset.type + ':' + query.params.asset.id + '&wt=json';

      } else {
        solrUrl = 'http://localhost:1234/solr/search/select?sort=' + field + '+' + order + '&start=' + query.offset + '&q=location.' + query.params.asset.type + ':' + query.params.asset.id + '&fl=dc.title,author,dc.publisher,dateIssued.year,handle,search.resourceid,numFound&wt=json';

      }

    }  else if (query.params.query.action === 'list' && query.params.query.terms.length > 0)         {

      // todo

    }

    console.log('solr url is ' + solrUrl);

    return solrUrl;


  };

  exports.processAuthor = function (solrResponse, returnAuthors) {

    var json = solrResponse.facet_counts.facet_fields;

    var ret = {};

    var authorArr = [];


    if (returnAuthors === true) {
      var authors = json.bi_2_dis_filter;
      var count = 0;
      for (var i = 0; i < authors.length; i++) {
        if (i % 2 === 0) {
          var author = authors[i].split('|||');
          authorArr[count] = {author: author[1]};
          count++;
        }
      }
    }
    var docsArr = [];
    for (var i = 0; i < solrResponse.response.docs.length; i++) {
      console.log(solrResponse.response.docs[i]);
      docsArr[i] = solrResponse.response.docs[i];
    }

    ret.results = docsArr;
    ret.authors = authorArr;
    ret.count = json.numFound;

    return ret;

  };

  exports.processTitleDate = function (solrResponse) {

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

  };


})();

