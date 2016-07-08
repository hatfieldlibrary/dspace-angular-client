/**
 * Creates solr queries for various solr query types.
 * Created by mspalti on 3/28/16.
 */

(function () {

  var constants = require('./constants');
  /**
   * Solr query functions.
   */
  var authorFacets = require('./solrQueries/authorFacets');
  var subjectFacets = require('./solrQueries/subjectFacets');
  var titlesList = require('./solrQueries/titlesList');
  var datesList = require('./solrQueries/byDateList');
  var jumpToLetter = require('./solrQueries/jumpToLetter');
  var jumpToDate = require('./solrQueries/jumpToDate');
  var authorBrowse = require('./solrQueries/authorBrowse');
  var subjectBrowse = require('./solrQueries/subjectBrowse');
  var discovery = require('./solrQueries/discovery');


  /**
   * Gets the solr url for finding the location of an item
   * in the index.
   *
   * @param query  the query parameters
   * @param dspaceToken token from the current session
   * @returns {string} solr url
   */
  exports.getOffsetUrl = function (query, dspaceToken) {

    var solrUrl = '';

    if (query.params.jumpTo.type === constants.QueryType.START_LETTER) {
      solrUrl = jumpToLetter(query, dspaceToken);

    }
    else if (query.params.jumpTo.type === constants.QueryType.START_DATE) {
      solrUrl = jumpToDate(query, dspaceToken);
    }

    return solrUrl;

  };


  /**
   * Returns the solr url based on the query type.
   *
   * @param query the query parameters
   * @param dspaceToken token from the current session
   * @returns {string} the solr url
   */
  exports.getSolrUrl = function (query, dspaceToken) {

    var solrUrl = '';

    console.log('query type: ' + query.params.query.qType);
    console.log('query field: ' +query.params.query.field)
    console.log('expecting ' + constants.QueryFields.AUTHOR)
    console.log('terms: ' + query.params.query.terms)
    console.log('action: ' + query.params.query.action)

    console.log(query.params)

    /**
     * Get the solr URL for a LIST query.
     */
    if (query.params.query.action === constants.QueryActions.LIST) {


      if (query.params.query.qType === constants.QueryType.AUTHOR_FACETS) {
        solrUrl = authorFacets(query, dspaceToken);   // get authors list

      }
      else if (query.params.query.qType === constants.QueryType.SUBJECT_FACETS) {
        solrUrl = subjectFacets(query, dspaceToken);  // get subjects list

      }

      else if (query.params.query.qType === constants.QueryType.TITLES_LIST) {
        solrUrl = titlesList(query, dspaceToken);   // list items by title

      }

      else if (query.params.query.qType === constants.QueryType.DATES_LIST) {

        solrUrl = datesList(query, dspaceToken);     // list items by date

      }

    }

    /**
     * Get the URL for a BROWSE query.
     */
    else if (query.params.query.action === constants.QueryActions.BROWSE
      && query.params.query.terms.length > 0) {

      /**
       * These are the query types for browse searches.  Check the QueryField
       * to determine which solrUrl will be generated.
       */
      if (query.params.query.field === constants.QueryFields.AUTHOR) {
        console.log('requesting items by author : ' + constants.QueryFields.AUTHOR)
        solrUrl = authorBrowse(query, dspaceToken);   // search for items by author

      }
      else if (query.params.query.field === constants.QueryFields.SUBJECT) {
        solrUrl = subjectBrowse(query, dspaceToken);  // search for items by subject

      }

    }

    /**
     * Get the URL for a SEARCH (discovery) query.
     */
    else if (query.params.query.action === constants.QueryActions.SEARCH
      && query.params.query.terms.length > 0) {

      if (query.params.query.qType === constants.QueryType.DISCOVER) {
        console.log('getting discovery url')
        solrUrl = discovery(query, dspaceToken);   // discovery

      }
    }

    console.log('solr url is....');
    console.log(solrUrl);

    return solrUrl;


  };


})();


