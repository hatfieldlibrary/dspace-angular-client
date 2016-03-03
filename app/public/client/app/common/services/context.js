'use strict';

var dspaceContext = angular.module('dspaceContext', []);


/**
 * Returns singleton object used to share state
 * among controllers. At the moment, we have only
 * one controller and no data to share.  If that remains
 * the case, no need for context!
 */
dspaceContext.service('Data', function () {


  return {

    context: {

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
           * The type of query (list, browse or search).
           */
          action: '',
          /**
           * The mode of query (any, all).
           */
          mode: '',
          /**
           * The query terms.
           */
          terms: '',
          /**
           * The browseFormat can be 'title', 'subject', 'date' or 'author'.
           */
          browseFormat: ''
        },
        /**
         * Indicates whether to return authors array from solr author facet query.
         * Facet query is used by collection view sort by author field option.
         */
        returnAuthorsList: false
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

    },

    getContext: function () {
      return context;
    },

    shouldReturnAuthorsList: function (value) {
      this.context.query.returnAuthorsList = value;
    },

    setAuthorsList: function(list) {
      this.context.authorArray = list;
    },

    setBrowse: function (type, id, action, terms, browseFormat) {

      this.context.query.asset.type = type;
      this.context.query.asset.id = id;
      this.context.query.query.action = action;
      // context.query.query.mode = '';
      this.context.query.query.terms = terms;
      this.context.query.query.browseFormat = browseFormat;

    },

    setBrowseFormat: function (format) {
      this.context.query.browseFormat = format;
    },

    setList: function (type, id, field, order, action, browseFormat) {

      this.context.query.asset.type = type;
      this.context.query.asset.id = id;
      this.context.query.sort.field = field;
      this.context.query.sort.order = order;
      this.context.query.query.action = action;
      this.context.query.query.browseFormat = browseFormat;
    },

    setSearch: function (terms, id) {

      context.query.asset.id = id;
      context.query.query.terms = terms;
    },

    setSort: function (field, order) {
      this.context.query.sort.field = field;
      this.context.query.sort.order = order;
    },

    clearQuery: function () {

      this.context.query.asset.type = '';
      this.context.query.asset.id = '';
      this.context.query.sort.field = '';
      this.context.query.sort.order = '';
      this.context.query.query.action = '';
      this.context.query.query.mode = '';
      this.context.query.query.terms = '';
      this.context.query.query.browseFormat = '';

    }

  };
});

