'use strict';

var dspaceContext = angular.module('dspaceContext', []);


/**
 * Returns singleton object used to share state
 * among controllers. At the moment, we have only
 * one controller and no data to share.  If that remains
 * the case, no need for context!
 */
dspaceContext.service('QueryManager', ['QueryFields', function (QueryFields) {


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
           * The solr query type.  Possible values are defined in QueryTypes.
           */
          type: '',
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
           * The field can be 'title', 'subject', 'date' or 'author'.
           */
          field: '',
          /**
           * The current offset used by paging.
           */
          offset: ''
        }
      },
      /**
       * The array of authors returned by browse/sort by author query. This is
       * cached so that the array (which can be large) isn't returned with every
       * paging request.
       */
      authorArray: [],

      subjectArray: [],
      /**
       * Tracks whether or not a current DSpace session exists.
       */
      hasDspaceSession: false

    },

    getContext: function () {
      return this.context;
    },

    setOffset: function (offset) {
      this.context.query.query.offset = offset;
    },

    getCurrentOffset: function () {
      return this.context.query.query.offset;
    },

    isAuthorListRequest: function () {
      return (this.context.query.field === QueryFields.AUTHOR);
    },

    isSubjectListRequest: function () {
      return (this.context.query.field === QueryFields.SUBJECT);
    },

    setAuthorsList: function (list) {
      this.context.authorArray = list;
    },

    setSubjectList: function(list) {
       this.context.subjectArray = list;
    },

    getAuthors: function () {
      return this.context.authorArray;
    },

    getSubjects: function () {
      return this.context.subjectArray;
    },

    getAuthorsCount: function () {
      if (this.context.authorArray !== undefined)
      {
        return this.context.authorArray.length;
      }
      return 0;
    },

    getSubjectsCount: function () {
      if (this.context.subjectArray !== undefined)
      {
        return this.context.subjectArray.length;
      }
      return 0;
    },

    setAction: function (action) {
      this.context.query.query.action = action;
    },

    getSearchField: function () {
      return this.context.query.field;
    },

    setQueryType: function(type) {
        this.context.query.query.type = type;
    },

    setBrowse: function (type, id, terms, action, field) {

      this.context.query.asset.type = type;
      this.context.query.asset.id = id;
      this.context.query.query.action = action;
      // context.query.query.mode = '';
      this.context.query.query.terms = terms;
      this.context.query.query.field = field;

    },

    setSearchField: function (field) {
      this.context.query.field = field;
    },

    setList: function (type, id, order, action, field) {

      this.context.query.asset.type = type;
      this.context.query.asset.id = id;
     //rt.field = sortField;
      this.context.query.sort.order = order;
      this.context.query.query.action = action;
      this.context.query.query.field = field;
    },

    setSearch: function (terms, id) {

      context.query.query.terms = terms;
      context.query.asset.id = id;
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
      this.context.query.query.field = '';

    }

  };
}]);

