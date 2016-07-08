'use strict';

/**
 * The query manager service is used to configure REST and solr
 * queries.
 */
dspaceContext.service('QueryManager', [
  'QueryTypes',
  'QueryActions',
  'QuerySort',
  'QueryFields',

  function (QueryTypes,
            QueryActions,
            QuerySort,
            QueryFields) {


    var _context = {

      query: {
        asset: {
          /** Community, collection or item (comm, coll, item). */
          type: '',
          /** DSpace internal id. */
          id: '',
          /** DSpace handle */
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

    };


    function getQuery() {
      return _context.query;
    }

    function getHandle() {
      return _context.query.asset.handle;
    }

    function setHandle(handle) {
      _context.query.asset.handle = handle;
    }

    function setQuery(queryObject) {
      _context.query = queryObject;
    }

    function setFilter(filter) {
      _context.query.query.filter = filter;
    }

    function getFilter() {
      return _context.query.query.filter;
    }

    function setRows(rowCount) {
      _context.query.rows = rowCount;
    }

    function getRows() {
      return _context.query.rows;
    }

    function setJumpType(type) {
      _context.query.jumpTo.type = type;
    }

    function getJumpType() {
      return _context.query.jumpTo.type;
    }

    function setOffset(offset) {
      // Add unary plus operator to assure we are using an integer.
      _context.query.query.offset = +offset;
    }

    function getOffset() {
      return _context.query.query.offset;
    }


    function setAssetType(type) {
      _context.query.asset.type = type;
    }

    function getAssetType() {
      return _context.query.asset.type;
    }

    function setAssetId(id) {
      _context.query.asset.id = id;
    }

    function getAssetId() {
      return _context.query.asset.id;
    }

    function getAction() {
      return _context.query.query.action;
    }

    function setAction(action) {
      _context.query.query.action = action;
    }

    function getSearchField() {
      return _context.query.query.field;
    }

    function setSearchField(field) {
      _context.query.query.field = field;
    }

    function setQueryType(type) {
      console.log(type)
      _context.query.query.qType = type;
    }

    function getQueryType() {
      return _context.query.query.qType;
    }

    function setBrowseField(field) {
      _context.query.query.field = field;
    }

    function getBrowseField() {
      return _context.query.query.field;
    }

    function setSearchTerms(terms) {

      _context.query.query.terms = terms;
    }

    function getSearchTerms() {
      return _context.query.query.terms;
    }

    function setSort(order) {
      _context.query.sort.order = order;
    }

    function getSort() {
      return _context.query.sort.order;
    }

    function addDiscoveryFilter(filter) {
      _context.query.filters.push(filter);
    }

    function removeDiscoveryFilter(position) {
      _context.query.filters.splice(position, 1);

    }

    function clearDiscoveryFilters() {
      _context.query.filters = [];
    }


    return {

      getQuery: getQuery,
      getHandle: getHandle,
      setHandle: setHandle,
      setQuery: setQuery,
      setFilter: setFilter,
      getFilter: getFilter,
      setRows: setRows,
      getRows: getRows,
      setJumpType: setJumpType,
      getJumpType: getJumpType,
      setOffset: setOffset,
      getOffset: getOffset,

      setAssetType: setAssetType,
      getAssetType: getAssetType,
      setAssetId: setAssetId,
      getAssetId: getAssetId,
      setAction: setAction,
      getAction: getAction,
      setSearchField: setSearchField,
      getSearchField: getSearchField,
      setQueryType: setQueryType,
      getQueryType: getQueryType,
      setBrowseField: setBrowseField,
      getBrowseField: getBrowseField,
      setSearchTerms: setSearchTerms,
      getSearchTerms: getSearchTerms,
      setSort: setSort,
      getSort: getSort,
      addDiscoveryFilter: addDiscoveryFilter,
      removeDiscoveryFilter: removeDiscoveryFilter,
      clearDiscoveryFilters: clearDiscoveryFilters

    };

  }]);

