'use strict';

/**
 * Returns singleton object used to share state
 * among controllers. At the moment, we have only
 * one controller and no data to share.  If that remains
 * the case, no need for context!
 */
dspaceContext.service('QueryManager', ['QueryTypes', 'QueryActions', 'QuerySort', 'QueryFields', function (QueryTypes, QueryActions, QuerySort, QueryFields) {


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
          field: '',   // unused, the sort field is included in the solr query that's assigned to the QueryType.
          /** Solr sort order. */
          order: QuerySort.ASCENDING
        },
        jumpTo: {
          type: ''
        },
        query: {
          /**
           * The solr query type.  Possible values are defined in QueryTypes.
           */
          qType: QueryTypes.TITLES_LIST,
          /**
           * The type of query (list, browse or search).
           */
          action: QueryActions.LIST,
          /**
           * The mode of query (any, all).
           */
          mode: '',
          /**
           * Filter terms.
           */
          filter: '',
          /**
           * The query terms.
           */
          terms: '',
          /**
           * The field can be 'title', 'subject', 'date', 'author' or 'discover'.
           */
          field: QueryFields.TITLE,
          /**
           * The current offset used by paging.
           */
          offset: 0,
          /**
           * The number of rows to return.  20 is the default.
           */
          rows: 20
        }
      }

    },

    getQuery: function() {
      return this.context.query;
    },

    setQuery: function(queryObject) {
      this.context.query = queryObject;

    },

    setFilter: function(filter)  {
      this.context.query.query.filter = filter;
    },

    getFilter: function() {
      return this.context.query.query.filter;
    },

    setRows: function(rowCount) {
      this.context.query.rows = rowCount;
    },

    getRows: function() {
      return this.context.query.rows;
    },

    setJumpType: function (type) {
      this.context.query.jumpTo.type = type;
    },

    getJumpType: function () {
      return this.context.query.jumpTo.type;
    },

    setOffset: function (offset) {
      // Add unary plus operator to assure we are using an integer.
      this.context.query.query.offset = +offset;
    },

    getOffset: function () {
      return this.context.query.query.offset;
    },

    isAuthorListRequest: function () {
      return (this.context.query.query.qType === QueryTypes.AUTHOR_FACETS);
    },

    isSubjectListRequest: function () {
      return (this.context.query.query.qType === QueryTypes.SUBJECT_FACETS);
    },

    isDiscoveryListRequest: function () {
      return (this.context.query.query.qType == QueryTypes.DISCOVER);
    },

    setAssetType: function (type) {
      this.context.query.asset.type = type;
    },
    setAssetId: function (id) {
      this.context.query.asset.id = id;
    },

    getAssetType: function () {
      return this.context.query.asset.type;
    },

    getAssetId: function () {
      return this.context.query.asset.id;
    },

    getAction: function () {
      return this.context.query.query.action;
    },

    setAction: function (action) {
      this.context.query.query.action = action;
    },

    getSearchField: function () {
      return this.context.query.query.field;
    },

    setSearchField: function (field) {
      this.context.query.query.field = field;
    },

    setQueryType: function (type) {
      this.context.query.query.qType = type;
    },

    getQueryType: function () {
      return this.context.query.query.qType;
    },

    setBrowseField: function (field) {
      this.context.query.query.field = field;
    },

    getBrowseField: function () {
      return this.context.query.query.field;
    },

    setSearchTerms: function (terms) {

      this.context.query.query.terms = terms;
    },

    getSearchTerms: function() {
      return this.context.query.query.terms;
    },

    setSort: function (order) {

      //  this.context.query.sort.field = field;
      this.context.query.sort.order = order;
    },

    getSort: function () {
      return this.context.query.sort.order;
    }


  };
}]);

