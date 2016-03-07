/**
 * Created by mspalti on 3/1/16.
 */

'use strict';


(function () {

  var util = require('util');
  var utils = require('./utils');
  var config = require('../../config/environment');
  var constants = require('./constants');
  var solrQueries = require('./solrQueries');


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
  exports.getSolrUrl = function (query) {

    var field = '';
    var order = 'asc';
    var solrUrl = '';

    // in practice, this may not be needed since this app will run on dspace host.
    var host = utils.getURL();

    /**
     * In the current implementation, only the LIST query uses the sort
     * parameter.
     */
    if (query.params.query.action === constants.QueryActions.LIST) {

      if (query.params.sort.field.length > 0) {
        field = query.params.sort.field;
      }

      if (query.params.sort.order.length > 0) {
        order = query.params.sort.order;
      }

    }

    /**
     * Get the solr URL for a LIST query.
     */
    if (query.params.query.action === constants.QueryActions.LIST && field.length > 0) {

      if (field === 'bi_2_dis_filter') {
        // List authors.
        solrUrl = util.format(
          solrQueries.listCollectionAuthor,
          query.params.asset.type,
          query.params.asset.id
        );

      } else {
        // This is the default query upon opening a collection page.
        // Used for listing by title and date fields.
        solrUrl = util.format(
          solrQueries.listCollectionItem,
          field,
          order,
          query.offset,
          query.params.asset.type,
          query.params.asset.id
        );

      }

    }

    /**
     * Get the URL for a BROWSE query.
     */
    else if (query.params.query.action === constants.QueryActions.BROWSE) {

      if (query.params.query.terms.length > 0) {   // browse with search term

        solrUrl = util.format(
          solrQueries.browseCollectionTerms,
          query.params.asset.type,
          query.params.asset.id,
          query.params.query.terms,
          query.params.offset
        );

      }
    }

    /**
     * Get the URL for a SEARCH (discovery) query.
     */
    else if (query.params.query.action === constants.QueryActions.SEARCH && query.params.query.terms.length > 0) {

      var location;
      if (query.params.query.id.length > 0) {
        location = '&fq=location:l' + query.params.query.id;
      }
      solrUrl = util.format(
        solrQueries.discover,
        query.params.query.terms,
        query.params.offset,
        query.params.query.terms,
        location
      )
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

  /**
   * Item lists returned by solr queries have a similar structure.
   * This method parses the response and returns relevant data to
   * the client.
   *
   * @param solrResponse
   * @returns {{}}
   */
  exports.processItems = function (solrResponse) {

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

