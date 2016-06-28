/**
 * The application context service is a place for storing and updating
 * application state.
 */

'use strict';

(function () {

  dspaceContext.service('AppContext', [
    'AppConfig',
    function (AppConfig) {

      var _context = {

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
         * The index of the currently list item.  This is currently used by author
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

      function setCurrentIndex(index) {
        _context.currentListIndex = index;
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

      function reverseAuthorList() {
        reverseArray(_context.authorArray);
      }

      function reverseSubjectList() {
        reverseArray(_context.subjectArray);
      }
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

      return {

        getContext: getContext,
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
        setCurrentIndex: setCurrentIndex,
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
        reverseAuthorList: reverseAuthorList,
        reverseSubjectList: reverseSubjectList

      }

    }]);

})();
