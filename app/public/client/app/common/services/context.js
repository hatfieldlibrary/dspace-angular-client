'use strict';

var dspaceContext = angular.module('dspaceContext', []);


/**
 * Returns singleton object used to share state
 * among controllers. At the moment, we have only
 * one controller and no data to share.  If that remains
 * the case, no need for context!
 */
dspaceContext.factory('Data', function () {

  return {

    query: {
      asset: {
        /** Community, collection or item (comm, coll, item). */
        type: '',
        /** DSpace internal id. */
        id: ''
      },
      sort: {
        /** Solr sort field. */
        field: '',
        /** Solr sort order. */
        order: ''
      },
      query: {
        /**
         * The type of query (list or search).
         */
        action: '',
        /**
         * The mode of query (any, all).
         */
        mode: '',
        /**
         * The query terms.
         */
        terms: ''
      },
      /**
       * The resultFormat can be either an item or an author (in the
       * case of a solr author facet query).
       */
      resultFormat: '',
      /**
       * Indicates whether to return authors array from solr author facet query.
       * Facet query is used by collection view sort by author field option.
       */
      returnAuthors: false
    },
    /**
     * The array of authors returned by browse/sort by author query. This is
     * cached so that the array (which can be large) isn't returned with every
     * paging request.
     */
    authorArray: [],
    /**
     * Tracks whether or not a current DSpace session exists.
     */
    hasDspaceSession: false

  };

});

