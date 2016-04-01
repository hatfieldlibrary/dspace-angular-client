'use strict';

var dspaceContext = angular.module('dspaceContext', []);


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
          offset: 0
        }
      },
      count: 0,
      /**
       * The array of authors returned by browse/sort by author query. This is
       * cached so that the array (which can be large) isn't returned with every
       * paging request.
       */
      authorArray: [],
      /**
       * The array of subjects returned by browse/sort by subject query. This is
       * cached so that the array (which can be large) isn't returned with every
       * paging request.
       */
      subjectArray: [],

      currentListIndex: -1,
      /**
       * Tracks whether or not a current DSpace session exists.
       */
      hasDspaceSession: false

    },

    getContext: function () {
      return this.context;
    },

    getCurrentIndex: function () {
      return this.context.currentListIndex;
    },

    setCurrentIndex: function (index) {
      this.context.currentListIndex = index;
    },

    setCount: function (count) {
      this.context.count = count;
    },

    getCount: function () {
      return this.context.count;
    },

    setJumpType: function (type) {
      this.context.query.jumpTo.type = type;
    },

    getJumpType: function () {
      return this.context.query.jumpTo.type;
    },

    setOffset: function (offset) {
      this.context.query.query.offset = offset;
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

    setAuthorsList: function (list) {
      this.context.authorArray = list;
    },

    setSubjectList: function (list) {
      this.context.subjectArray = list;
    },

    getAuthors: function () {
      return this.context.authorArray;
    },

    getSubjects: function () {
      return this.context.subjectArray;
    },

    getAuthorsCount: function () {
      if (this.context.authorArray !== undefined) {
        return this.context.authorArray.length;
      }
      return 0;
    },

    getSubjectsCount: function () {
      if (this.context.subjectArray !== undefined) {
        return this.context.subjectArray.length;
      }
      return 0;
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
      console.log(this.context.query.query.qType)
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

    setSort: function (order) {

      //  this.context.query.sort.field = field;
      this.context.query.sort.order = order;
    },

    getSort: function () {
      return this.context.query.sort.order;
    }


  };
}]);

