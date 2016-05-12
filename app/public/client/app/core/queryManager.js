'use strict';

/**
 * The query manager service is used to configure both REST and solr
 * queries.  The query object is typically passed in the body of a POST
 * to the Express server via an Angular request service.
 */
dspaceContext.service('QueryManager', [

  'QueryTypes',
  'QueryActions',
  'QuerySort',
  'QueryFields',
  'AppContext',

  function (QueryTypes,
            QueryActions,
            QuerySort,
            QueryFields) {

    return {

      context: {

        query: {
          asset: {
            /** Community, collection or item (comm, coll, item). */
            type: '',
            /** DSpace internal id. */
            id: '',
            
            handle: ''
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
          /**
           * Filters for solr queries
           */
          filters: [],

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
             * Filter terms for collection browsing.
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

      getQuery: function () {
        return this.context.query;
      },

      getHandle: function () {
        return  this.context.query.asset.handle;
      },
      
      setHandle: function(handle) {
        this.context.query.asset.handle = handle;
      },

      setQuery: function (queryObject) {
        this.context.query = queryObject;

      },

      setFilter: function (filter) {
        this.context.query.query.filter = filter;
      },

      getFilter: function () {
        return this.context.query.query.filter;
      },

      setRows: function (rowCount) {
        this.context.query.rows = rowCount;
      },

      getRows: function () {
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
        return (this.context.query.query.qType === QueryTypes.DISCOVER);
      },

      setAssetType: function (type) {
        console.log('setting asset type to ' + type);
        this.context.query.asset.type = type;
      },
      setAssetId: function (id) {
        console.log('setting asset id to ' + id);
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

      getSearchTerms: function () {
        return this.context.query.query.terms;
      },

      setSort: function (order) {
        this.context.query.sort.order = order;
      },

      getSort: function () {
        return this.context.query.sort.order;
      },

      addDiscoveryFilter: function (filter) {
        this.context.query.filters.push(filter);
      },

      removeDiscoveryFilter: function (position) {
        this.context.query.filters.splice(position, 1);

      },

      clearDiscoveryFilters: function () {
        this.context.query.filters = [];
      }


    };
  }]);

