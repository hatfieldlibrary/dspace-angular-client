/**
 * Created by mspalti on 3/1/16.
 */

'use strict';


(function () {

  var utils = require('./utils');
  var config = require('../../config/environment');

  /**
   * Checks for dspace token in the current session and
   * returns token if present.
   * @param session the Express session object
   * @returns {*} token or empty string
   */
  exports.getDspaceToken = function (session) {

    var dspaceTokenHeader;

    if ('getDspaceToken' in session) {
      dspaceTokenHeader = session.getDspaceToken;
    } else {
      dspaceTokenHeader = '';
    }

    return dspaceTokenHeader;
  };

  /**
   * Sets response header and sends json.
   * @param res  the Express response object
   * @param json   data to return
   */
  exports.jsonResponse = function (res, json) {

    // Set custom response header.
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.json(json);

  };

  /**
   * Removes the dspace token from the current session if
   * the token is present.
   * @param session  the Express session object
   */
  exports.removeDspaceSession = function (session) {

    if ('dspaceToken' in session) {
      delete session.getDspaceToken;

    }
  };



  /**
   * Returns fully qualified URL for the host and port (from configuration).
   * @returns {string}
   */
  exports.getURL = function() {
    return config.dspace.protocol + '://' + config.dspace.host + ':' + config.dspace.port;
  };


  /**
   * Returns the host name from configuration.
   * @returns {*}
   */
  exports.getHost = function() {
    return config.dspace.host;
  };

  /**
   * Returns the host port from configuration.
   * @returns {number|*}
   */
  exports.getPort = function() {
    return config.dspace.port;
  };

  exports.getSolrUrl = function (query) {

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

        // collection author list
        solrUrl = 'http://localhost:1234/solr/search/select?facet=true&facet.mincount=1&facet.offset=' + query.offset + '&rows=' + rows + '&f.bi_2_dis_filter.facet.sort=index&fl=handle,search.resourcetype,search.resourceid&start=' + query.offset + '&f.bi_2_dis_filter.facet.limit=-1&q=*:*&facet.field=bi_2_dis_filter&fq=NOT(withdrawn:true)&fq=NOT(discoverable:false)&fq=location.' + query.params.asset.type + ':' + query.params.asset.id + '&wt=json';

      } else {

        // collection title and date list
        solrUrl = 'http://localhost:1234/solr/search/select?sort=' + field + '+' + order + '&start=' + query.offset + '&q=location.' + query.params.asset.type + ':' + query.params.asset.id + '&fl=dc.title,author,dc.publisher,dateIssued.year,handle,search.resourceid,numFound&wt=json';

      }

    }

    else if (query.params.query.action === 'browse' && query.params.query.terms.length > 0) {

      // browse collection by field and query term
      solrUrl = 'http://localhost:1234/solr/search/select?q=*:*&fl=handle,search.resourcetype,search.resourceid,dc.title,author,dc.publisher,dateIssued.year,dc.description.abstract_hl&fq=NOT(withdrawn:true)&fq=NOT(discoverable:false)&fq=location.' +
        query.params.asset.type + ':' +
        query.params.asset.id +
        '&fq={!field+f=bi_2_dis_value_filter}' +
        encodeURIComponent(query.params.query.terms) +
        '&fq=search.resourcetype:2&start=' +
        query.offset +
        '&wt=json&version=2';

      solrUrl = 'http://localhost:1234/solr/search/select?fl=handle,search.resourcetype,search.resourceid,dc.title,author,dc.publisher,dateIssued.year,dc.description.abstract_hl&start=0&q=bi_sort_1_sort:+[*+TO+%22land%22}&wt=json&fq=NOT(withdrawn:true)&fq=NOT(discoverable:false)&fq=location.coll:87&fq=search.resourcetype:2&version=2&rows=10';
    }

    else if (query.params.query.action === 'search' && query.params.query.terms.length > 0) {

      var location;
      if (query.params.query.id.length > 0) {
        location = '&fq=location:l' + query.params.query.id;
      }

      // search (discovery) global or within collection
      solrUrl = 'http://localhost:1234/solr/search/select?f.dc.title_hl.hl.snippets=5&f.dc.title_hl.hl.fragsize=0&spellcheck=true&sort=score+desc&spellcheck.q=' +
        encodeURIComponent(query.params.query.terms) +
        '&f.fulltext_hl.hl.fragsize=250&hl.fl=dc.description.abstract_hl&hl.fl=dc.title_hl&hl.fl=dc.contributor.author_hl&hl.fl=fulltext_hl&wt=json&spellcheck.collate=true&hl=true&version=2&rows=10&f.fulltext_hl.hl.snippets=2&f.dc.description.abstract_hl.hl.snippets=2&f.dc.contributor.author_hl.hl.snippets=5&fl=handle,search.resourcetype,search.resourceid&start=' +
        query.offset +
        '&q=' +
        encodeURIComponent(query.params.query.terms) +
        '&f.dc.contributor.author_hl.hl.fragsize=0&hl.usePhraseHighlighter=true&f.dc.description.abstract_hl.hl.fragsize=250&fq=NOT(withdrawn:true)&fq=NOT(discoverable:false)' +
        location;

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

