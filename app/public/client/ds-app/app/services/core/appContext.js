/**
 * The application context service is a place for storing and updating
 * application state.
 */

(function () {

  'use strict';

  dspaceContext.service('AppContext',
    function (AppConfig, QuerySort, QueryManager, QueryTypes) {

      /**
       * Reverses the array values.  Used to sort subjects
       * and authors by ascending and descending.
       * @param arr
       */
      function reverseArray(arr) {
        var i = 0;
        var j = arr.length - 1;
        while (i < j) {
          var x = arr[i];
          arr[i] = arr[j];
          arr[j] = x;
          i++;
          j--;
        }
      }

      var _context = {

        defaultItemsField: QueryTypes.DATES_LIST,

        defaultItemsSort: QuerySort.DESCENDING,

        communitiesList: {},

        isFilter: false,

        initOffset: 0,

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

        /**
         * The pager component is shared by the collection and browse components.  When the
         * user moves from list to browse view, the list offset value is tracked outside
         * of the query object so that it can be restored on return to the list view.  Default
         * to zero.
         */
        listOffset: 0,

        startIndex: 0,


        /**
         * These values are set by the sort options component, which is shared by collection
         * and browse components.  We need to track the 'list' and 'browse' states separately
         * so that the loader knows whether author and subject arrays need to be reversed.
         * That is determined by comparing the query string's sort order with the one
         * tracked here.  Default to ascending.
         */
        authorOrder: QuerySort.ASCENDING,

        subjectOrder: QuerySort.ASCENDING,

        newSet: true,

        /**
         * The index of the currently selected list item.  This is used by author
         * and subject facets to activate a card that contains item information.
         */
        currentListIndex: -1,

        /**
         * The current item count.
         */
        count: 0,

        /**
         * The context can be either DiscoveryContext.ADVANCED_SEARCH or
         * DiscoveryContext.BASIC_SEARCH.
         */
        discoveryContext: '',


        /** Show the pager */
        pager: false,

        /** List of communities used in advanced search and discovery search forms */
        discoveryCommunities: [],

        /** Permission to submit */
        canSubmit: false,

        /** Permission to administer current object. */
        canAdminister: false,

        /** Permission to write */
        canWrite: false

      };

      function getContext() {
        return _context;
      }

      function isFilter(filter) {
        if (typeof filter !== 'undefined') {
          _context.isFilter = filter;
        } else {
          return _context.isFilter;
        }
      }

      function getDspaceHost() {
        return AppConfig.DSPACE_HOST;
      }

      function getDspaceRoot() {
        return AppConfig.DSPACE_ROOT;
      }

      function getHandlePrefix() {
        return AppConfig.HANDLE_PREFIX;
      }

      function useRedirect() {
        return AppConfig.USE_REDIRECT;
      }

      function getApplicationPrefix() {
        return AppConfig.APPLICATION_ROOT_PREFIX;
      }


      function setWritePermission(permission) {
        _context.canWrite = permission;
      }

      function getWritePermission() {
        return _context.canWrite;
      }

      function setAdministerPermission(permission) {
        _context.canAdminister = permission;
      }

      function getAdministerPermission() {
        return _context.canAdminister;
      }

      function setSubmitPermission(permission) {
        _context.canSubmit = permission;
      }

      function getSubmitPermission() {
        return _context.canSubmit;
      }

      function reverseAuthorList() {
        reverseArray(_context.authorArray);
      }

      function reverseSubjectList() {
        reverseArray(_context.subjectArray);

      }

      function setAuthorsList(list) {
        _context.authorArray = list;
      }

      function setSubjectList(list) {
        _context.subjectArray = list;
      }

      function getAuthors() {
        return _context.authorArray;
      }

      function getSubjects() {
        return _context.subjectArray;
      }

      function getAuthorsCount() {
        if (_context.authorArray !== undefined) {
          return _context.authorArray.length;
        }
        return 0;
      }

      function getSubjectsCount() {
        if (_context.subjectArray !== undefined) {
          return _context.subjectArray.length;
        }
        return 0;
      }

      function setItemsCount(count) {
        _context.count = count;
      }

      function getItemsCount() {
        return _context.count;
      }


      function setPager(showPager) {
        _context.pager = showPager;
      }

      function getPager() {
        return _context.pager;
      }

      function setDiscoverCommunities(arr) {
        _context.discoveryCommunities = arr;
      }

      function getDiscoverCommunities() {
        return _context.discoveryCommunities;
      }

      function setDiscoveryContext(context) {
        _context.discoveryContext = context;
      }

      function getDiscoveryContext() {
        return _context.discoveryContext;
      }

      function getSetSize() {
        return AppConfig.RESPONSE_SET_SIZE;
      }

      function getHomeLogo() {
        return AppConfig.HOME_LOGO;
      }

      function getHomeLink() {
        return AppConfig.HOME_LINK;
      }

      function setListOffset(offset) {
        _context.listOffset = offset;
      }

      function getListOffset() {
        return _context.listOffset;
      }

      function setAuthorsOrder(order) {
        _context.authorOrder = order;
      }

      function getAuthorsOrder() {
        return _context.authorOrder;
      }

      function setSubjectsOrder(order) {
        _context.subjectOrder = order;
      }

      function getSubjectsOrder() {
        return _context.subjectOrder;
      }

      function isNewSet(newSet) {
        if (typeof newSet !== 'undefined') {
          _context.newSet = newSet;
        } else {
          return _context.newSet;
        }
      }

      function setViewStartIndex(index) {
        if (index < 0 || typeof index === 'undefined') {
          index = 0;
        }
        _context.startIndex = +index;
      }

      function getViewStartIndex() {
        return _context.startIndex;
      }

      function isAuthorListRequest() {
        return (QueryManager.getQueryType() === QueryTypes.AUTHOR_FACETS);
      }

      function isSubjectListRequest() {
        return (QueryManager.getQueryType() === QueryTypes.SUBJECT_FACETS);
      }

      function isDiscoveryListRequest() {
        return (QueryManager.getQueryType() === QueryTypes.DISCOVER);
      }

      function isNotFacetQueryType() {
        return !isAuthorListRequest() && !isSubjectListRequest();
      }

      function getDefaultItemListField() {
        return _context.defaultItemsField;
      }

      function getDefaultSortOrder() {
        return _context.defaultItemsSort;
      }

      function setInitOffset(offset) {
        _context.initOffset = offset;
      }

      function getInitOffset() {
        return _context.initOffset;
      }

      function setCommunitiesList(list) {
        _context.communitiesList = list;
      }

      function getCommunitiesList() {
        return _context.communitiesList;
      }


      return {

        getContext: getContext,
        isFilter: isFilter,
        getDspaceHost: getDspaceHost,
        getDspaceRoot: getDspaceRoot,
        getHandlePrefix: getHandlePrefix,
        useRedirect: useRedirect,
        setAdministerPermission: setAdministerPermission,
        getAdministerPermission: getAdministerPermission,
        setWritePermission: setWritePermission,
        getWritePermission: getWritePermission,
        setSubmitPermission: setSubmitPermission,
        getSubmitPermission: getSubmitPermission,
        reverseAuthorList: reverseAuthorList,
        reverseSubjectList: reverseSubjectList,
        setAuthorsList: setAuthorsList,
        setSubjectList: setSubjectList,
        getAuthors: getAuthors,
        getSubjects: getSubjects,
        getAuthorsCount: getAuthorsCount,
        getSubjectsCount: getSubjectsCount,
        setItemsCount: setItemsCount,
        getItemsCount: getItemsCount,
        setPager: setPager,
        getPager: getPager,
        setDiscoverCommunities: setDiscoverCommunities,
        getDiscoverCommunities: getDiscoverCommunities,
        setDiscoveryContext: setDiscoveryContext,
        getDiscoveryContext: getDiscoveryContext,
        getSetSize: getSetSize,
        getHomeLogo: getHomeLogo,
        getHomeLink: getHomeLink,
        setListOffset: setListOffset,
        getListOffset: getListOffset,
        setAuthorsOrder: setAuthorsOrder,
        getAuthorsOrder: getAuthorsOrder,
        setSubjectsOrder: setSubjectsOrder,
        getSubjectsOrder: getSubjectsOrder,
        isAuthorListRequest: isAuthorListRequest,
        isSubjectListRequest: isSubjectListRequest,
        isDiscoveryListRequest: isDiscoveryListRequest,
        isNotFacetQueryType: isNotFacetQueryType,
        isNewSet: isNewSet,
        setViewStartIndex: setViewStartIndex,
        getViewStartIndex: getViewStartIndex,
        getDefaultItemListField: getDefaultItemListField,
        getDefaultSortOrder: getDefaultSortOrder,
        setInitOffset: setInitOffset,
        getInitOffset: getInitOffset,
        setCommunitiesList: setCommunitiesList,
        getCommunitiesList: getCommunitiesList,
        getApplicationPrefix: getApplicationPrefix

      };

    });

})();
