/**
 * Created by mspalti on 3/1/16.
 */

'use strict';


(function () {

  var util = require('util');
  var config = require('../../config/environment');
  var constants = require('./constants');
  var solrQueries = require('./solrQueries');


  /**
   * Generates the location solr filter for non-discovery queries.
   * When type and id are not provided, returns an empty string so
   * that the solr query executes without a location limit.
   * @param type  the asset type
   * @param id dspace identifier
   * @returns {string}  the location filter
   */
  function getLocation(type, id) {

    if (type.length > 0 && id !== undefined) {
      return '&fq=location.' + type + ':' + id;
    }

    return '';
  }

  /**
   * Sets the solr filter for anonymous queries when the Express
   * session cannot provide us with a valid dspaceToken.
   * @param dspaceToken
   * @returns {*}
     */
  function getAnonymousQueryFilter(dspaceToken) {

    if (dspaceToken.length === 0) {
      return '&fq=read:(g0+OR+g0+OR+g401+OR+g287)';
    }
    return '';

  }

  /**
   * Sets the location filter for discovery queries based on
   * the asset type (community or collection).  When type and
   * id are not provided, returns an empty string so that the
   * solr query executes without a location limit.
   * @param type   the asset type
   * @param id     the dspace id
   * @returns {*}   the location filter
     */
  function getDiscoverLocationFilter(type, id) {

    if (type.length > 0 && id !== undefined) {
      if (type === constants.AssetTypes.COMMUNITY) {
        return '&fq=location:m' + id;

      } else if (type === constants.AssetTypes.COLLECTION) {
        return '&fq=location:l' + id;

      }
    }
    return '';

  }


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
  exports.getURL = function () {
    return config.dspace.protocol + '://' + config.dspace.host + ':' + config.dspace.port;
  };


  /**
   * Returns the host name from configuration.
   * @returns {*}
   */
  exports.getHost = function () {
    return config.dspace.host;
  };

  /**
   * Returns the host port from configuration.
   * @returns {number|*}
   */
  exports.getPort = function () {
    return config.dspace.port;
  };

  /**
   * Returns the solr url based on the query type.
   *
   * @param query the query parameters
   * @returns {string} the url
   */
  exports.getSolrUrl = function (query, dspaceToken) {


    var order = 'asc';
    var solrUrl = '';

    console.log(query.params.query.qType);

    /**
     * In the current implementation, only the LIST query uses the sort
     * parameter.
     */
    if (query.params.query.action === constants.QueryActions.LIST) {

      //if (query.params.sort.field.length > 0) {
      //  field = query.params.sort.field;
      //}

      
      if (query.params.sort.order.length > 0) {
        order = query.params.sort.order;
      }

      console.log('sort order: ' + query.params.sort.order);
    }

    var anonymousQueryFilter = getAnonymousQueryFilter(dspaceToken);

    /**
     * Get the solr URL for a LIST query.
     */
    if (query.params.query.action === constants.QueryActions.LIST) {

      var location = getLocation(query.params.asset.type, query.params.asset.id);


      console.log(location);


      if (query.params.query.qType === constants.QueryType.AUTHOR_FACETS) {   // get authors list

        solrUrl = util.format(
          solrQueries[constants.QueryType.AUTHOR_FACETS],
          location,
          anonymousQueryFilter
        );
      }
      else if (query.params.query.qType === constants.QueryType.SUBJECT_FACETS) { // get subjects list
        solrUrl = util.format(
          solrQueries[constants.QueryType.SUBJECT_FACETS],
          location,
          anonymousQueryFilter
        );
      }

      else if (query.params.query.qType === constants.QueryType.TITLES_LIST) {   // list items by title
        solrUrl = util.format(
          solrQueries[constants.QueryType.TITLES_LIST],
          order,
          query.offset,
          location,
          anonymousQueryFilter
        );

      }

      else if (query.params.query.qType === constants.QueryType.DATES_LIST) {    // list items by date
        solrUrl = util.format(
          solrQueries[constants.QueryType.DATES_LIST],
          order,
          query.offset,
          location,
          anonymousQueryFilter
        );
      }

    }

    /**
     * Get the URL for a BROWSE query.
     */
    else if (query.params.query.action === constants.QueryActions.BROWSE
      && query.params.query.terms.length > 0) {

      var location = getLocation(query.params.asset.type, query.params.asset.id);

      if (query.params.query.field === constants.QueryFields.AUTHOR) {   // search for items by author
        solrUrl = util.format(
          solrQueries[constants.QueryType.AUTHOR_SEARCH],
          'asc',
          query.params.query.offset,
          query.params.query.terms,
          location,
          anonymousQueryFilter
        );

      }
      else if (query.params.query.field === constants.QueryFields.SUBJECT) {   // search for items by subject
        solrUrl = util.format(
          solrQueries[constants.QueryType.SUBJECT_SEARCH],
          'asc',
          query.params.query.offset,
          query.params.query.terms,
          location,
          anonymousQueryFilter
        );

      }
    }

    /**
     * Get the URL for a SEARCH (discovery) query.
     */
    else if (query.params.query.action === constants.QueryActions.SEARCH && query.params.query.terms.length > 0) {

      // discovery location filter
      var location = getDiscoverLocationFilter(query.params.asset.type, query.params.asset.id);

      if (query.params.query.qType === constants.QueryType.DISCOVER) {   // discovery
        solrUrl = util.format(
          solrQueries[constants.QueryType.DISCOVER],
          query.params.query.terms,
          query.params.query.offset,
          query.params.query.terms,
          location,
          anonymousQueryFilter
        );

      }
    }

    console.log('solr url is ' + solrUrl);

    return solrUrl;


  };


  /**
   * The author response is a facet object containing a list
   * of all authors for the collection or community. This method
   * parses the result returns the relevant data to the client.
   *
   * @param solrResponse  the solr response
   * @returns {{}}
   */
  exports.processAuthor = function (solrResponse) {

    var json = solrResponse.facet_counts.facet_fields;

    var ret = {};

    var authorArr = [];
    var authors = json.bi_2_dis_filter;

    var count = 0;
    var authorObj = {};

    for (var i = 0; i < authors.length; i++) {

      // The odd indicies in the response array contain count.
      // Add the count to the author object and add the author
      // object to the return array.
      if (i % 2 !== 0) {
        authorObj.count = authors[i];
        authorArr[count] = authorObj;
        count++;

      }
      // The even indicies contain author information.  Add to
      //   the author object.
      else {

        authorObj = {};
        var author = authors[i].split('|||');
        authorObj.author = author[1];

      }

    }

    var docsArr = [];

    for (var i = 0; i < solrResponse.response.docs.length; i++) {
      console.log(solrResponse.response.docs[i]);
      docsArr[i] = solrResponse.response.docs[i];
    }

    ret.results = docsArr;
    ret.authors = authorArr;
    ret.count = authorArr.length;

    return ret;

  };

  exports.processSubject = function (solrResponse) {

    var json = solrResponse.facet_counts.facet_fields;

    var ret = {};

    var authorArr = [];
    var authors = json.bi_4_dis_filter;

    var count = 0;
    var authorObj = {};


    for (var i = 0; i < authors.length; i++) {

      // The odd indicies in the response array contain count.
      // Add the count to the author object and add the author
      // object to the return array.
      if (i % 2 !== 0) {
        authorObj.count = authors[i];
        authorArr[count] = authorObj;
        count++;

      }
      // The even indicies contain author information.  Add to
      //   the author object.
      else {

        authorObj = {};
        var author = authors[i].split('|||');
        authorObj.author = author[1];

      }

    }

    var docsArr = [];

    for (var i = 0; i < solrResponse.response.docs.length; i++) {
      console.log(solrResponse.response.docs[i]);
      docsArr[i] = solrResponse.response.docs[i];
    }


    ret.results = docsArr;
    ret.authors = authorArr;
    ret.count = authorArr.length;

    console.log(ret);

    return ret;

  };

  /**
   * Item lists returned by solr queries have a similar structure.
   * This method parses the response and returns relevant data to
   * the client.
   *
   * @param solrResponse
   * @returns {{}}
   */
  exports.processItems = function (solrResponse) {

    console.log(solrResponse)

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

  exports.parseDiscoveryResult = function (json) {

    var docs = json.response.docs;
    var highlights = json.highlighting;
    var final = {};
    var resultArr = [];

    for (var i = 0; i < docs.length; i++) {

      var tmp = {};

      if (docs[i].handle !== undefined) {
        tmp.handle = docs[i].handle;
      }
      if (docs[i]['search.resourceid'] !== undefined) {
        tmp.resourceid = docs[i]['search.resourceid'];
      }
      if (docs[i]['search.resourcetype'] !== undefined) {
        tmp.resourcetype = docs[i]['search.resourcetype'];
      }
      var key = tmp.resourcetype + '-' + tmp.resourceid;
      tmp.title = highlights[key]['dc.title_hl'];
      tmp.description = highlights[key]['dc.description.abstract_hl'];

      resultArr[i] = tmp;
    }

    final.results = resultArr;
    final.count = json.response.numFound;

    return final;
  };


})();

