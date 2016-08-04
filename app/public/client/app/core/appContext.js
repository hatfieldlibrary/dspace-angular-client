/**
 * The application context service is a place for storing and updating
 * application state.
 */

'use strict';

(function () {

  dspaceContext.service('AppContext', [
    'AppConfig', 'QuerySort', 'QueryManager', 'QueryTypes',
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

        isFilter: false,

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

        selectedItemId: -1,

        openItem: -1,

        /**
         * These values are set by the sort options component, which is shared by collection
         * and browse components.  We need to track the 'list' and 'browse' states separately
         * so that the loader knows whether author and subject arrays need to be reversed.
         * That is determined by comparing the query string's sort order with the one
         * tracked here.  Default to ascending.
         */
        listOrder: QuerySort.ASCENDING,

        authorOrder: QuerySort.ASCENDING,

        subjectOrder: QuerySort.ASCENDING,

        nextPagerOffset: 0,

        previousPagerOffset: 0,

        newSet: true,

        /**
         * The index of the currently selected list item.  This is used by author
         * and subject facets to activate a card that contains item information.
         */
        currentListIndex: -1,

        /**
         * Tracks whether or not a current DSpace session exists.
         */
        hasDspaceSession: false,

        /**
         * The current item count.
         */
        count: 0,

        /**
         * The context can be either DiscoveryContext.ADVANCED_SEARCH or
         * DiscoveryContext.BASIC_SEARCH.
         */
        discoveryContext: '',

        /**
         * Menu status.
         */
        openMenu: false,

        /** Show the pager */
        pager: false,

        /** List of communities used in advanced search and discovery search forms */
        discoveryCommunities: [],

        /** Permission to submit */
        canSubmit: false,

        /** Permission to administer current object. */
        canAdminister: false,

        /** Permission to administer DSpace */
        canSysAdmin: false,

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

      function setSystemAdminPermission(permission) {
        _context.canSysAdmin = permission;
      }

      function getSystemAdminPermission() {
        return _context.canSysAdmin;
      }

      function setWritePermission(permission) {
        _context.canWrite = permission;
      }

      function getWritePermission () {
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

      function setSelectedPositionIndex(index) {
        _context.currentListIndex = +index;
      }

      function getSelectedPositionIndex() {
        return _context.currentListIndex;
      }

      function setAuthorsList(list) {
        _context.authorArray = list;
      }

      function setSubjectList(list) {
        _context.subjectArray = list;
      }

      function getAuthors () {
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

      function setCount(count) {
        _context.count = count;
      }

      function getCount() {
        return _context.count;
      }

      function setMenu(open) {
        _context.openMenu = open;
      }

      function getMenuState() {
        return _context.openMenu;
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

      function hasDspaceSession() {
        return _context.hasDspaceSession;
      }

      function updateDspaceSession(hasSession) {
        _context.hasDspaceSession = hasSession;
      }

      function setListOffset(offset) {
        _context.listOffset = offset;
      }

      function getListOffset() {
        return _context.listOffset;
      }

      function setListOrder(order) {
        _context.listOrder = order;
      }

      function getListOrder() {
        return _context.listOrder;
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

      function setStartIndex(index) {
        _context.startIndex = +index;
      }

      function getStartIndex() {
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

      function setOpenItem(itemPosition) {
        _context.openItem = +itemPosition;
      }

      function getOpenItem () {
        return _context.openItem;
      }

      function setSelectedItemId(itemId) {
        _context.selectedItemId = itemId;
      }

      function getSelectedItemId() {
        return _context.selectedItemId;
      }

      function setNextPagerOffset(offset) {
        _context.nextPagerOffset = offset;
      }

      function getNextPagerOffset() {
        return _context.nextPagerOffset;
      }

      function setPreviousPagerOffset(offset) {
        _context.previousPagerOffset = offset;
      }

      function getPreviousPagerOffset() {
        return _context.previousPagerOffset;
      }


      return {

        getContext: getContext,
        isFilter: isFilter,
        getDspaceHost: getDspaceHost,
        getDspaceRoot: getDspaceRoot,
        getHandlePrefix: getHandlePrefix,
        useRedirect: useRedirect,
        setSystemAdminPermission: setSystemAdminPermission,
        getSystemAdminPermission: getSystemAdminPermission,
        setAdministerPermission: setAdministerPermission,
        getAdministerPermission: getAdministerPermission,
        setWritePermission: setWritePermission,
        getWritePermission: getWritePermission,
        setSubmitPermission: setSubmitPermission,
        getSubmitPermission: getSubmitPermission,
        reverseAuthorList: reverseAuthorList,
        reverseSubjectList: reverseSubjectList,
        setSelectedPositionIndex: setSelectedPositionIndex,
        getSelectedPositionIndex: getSelectedPositionIndex,
        setAuthorsList: setAuthorsList,
        setSubjectList: setSubjectList,
        getAuthors: getAuthors,
        getSubjects: getSubjects,
        getAuthorsCount: getAuthorsCount,
        getSubjectsCount: getSubjectsCount,
        setCount: setCount,
        getCount: getCount,
        setMenu: setMenu,
        getMenuState: getMenuState,
        setPager: setPager,
        getPager: getPager,
        setDiscoverCommunities: setDiscoverCommunities,
        getDiscoverCommunities: getDiscoverCommunities,
        setDiscoveryContext: setDiscoveryContext,
        getDiscoveryContext: getDiscoveryContext,
        getSetSize: getSetSize,
        getHomeLogo: getHomeLogo,
        getHomeLink: getHomeLink,
        hasDspaceSession: hasDspaceSession,
        updateDspaceSession: updateDspaceSession,
        setListOffset: setListOffset,
        getListOffset: getListOffset,
        setListOrder: setListOrder,
        getListOrder: getListOrder,
        setAuthorsOrder: setAuthorsOrder,
        getAuthorsOrder: getAuthorsOrder,
        setSubjectsOrder: setSubjectsOrder,
        getSubjectsOrder: getSubjectsOrder,
        isAuthorListRequest: isAuthorListRequest,
        isSubjectListRequest: isSubjectListRequest,
        isDiscoveryListRequest: isDiscoveryListRequest,
        isNotFacetQueryType: isNotFacetQueryType,
        isNewSet: isNewSet,
        setStartIndex: setStartIndex,
        getStartIndex: getStartIndex,
        setOpenItem: setOpenItem,
        getOpenItem: getOpenItem,
        setSelectedItemId: setSelectedItemId,
        getSelectedItemId: getSelectedItemId,
        setNextPagerOffset: setNextPagerOffset,
        getNextPagerOffset: getNextPagerOffset,
        setPreviousPagerOffset: setPreviousPagerOffset,
        getPrevousPagerOffset: getPreviousPagerOffset

      };

    }]);

})();
