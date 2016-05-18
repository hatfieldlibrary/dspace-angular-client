/**
 * The application context service is a place for storing and updating
 * objects that the application needs to maintain state.
 */

'use strict';

(function () {

  dspaceContext.service('AppContext', function () {

    return {

      context: {

        handlePrefix: '10177',

        dspaceHost: 'http://158.104.3.30:8080',

        dspaceRoot: '/dspace5',

        useRedirect: true,

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
        
        discoveryContext: '',

        openMenu: false,

        pager: false,

        discoveryCommunities: [],

        canSubmit: false,

        canAdminister: false,

        canSysAdmin: false,

        canWrite: false

      },

      getContext: function () {
        return this.context;
      },

      getDspaceHost: function() {
        return this.context.dspaceHost;
      },

      getDspaceRoot: function() {
        return this.context.dspaceRoot;
      },

      getHandlePrefix: function() {
        return this.context.handlePrefix;
      },

      useRedirect: function () {
        return this.context.useRedirect;
      },

      setSystemAdminPermission: function (permission) {
        console.log('set sys ' + permission)
        this.context.canSysAdmin = permission;
      },

      getSystemAdminPermission: function () {
        console.log('get sys ' + this.context.canSysAdmin);
        return this.context.canSysAdmin;
      },

      setWritePermission: function (permission) {
        this.context.canWrite = permission;
      },

      getWritePermission: function () {
        return this.context.canWrite;
      },

      setAdministerPermission: function (permission) {
        this.context.canAdminister = permission;
      },

      getAdministerPermission: function () {
        return this.context.canAdminister;
      },

      setSubmitPermission: function (permission) {
        this.context.canSubmit = permission;
      },

      getSubmitPermission: function () {
        return this.context.canSubmit;
      },

      setCurrentIndex: function (index) {
        this.context.currentListIndex = index;
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

      setCount: function (count) {
        this.context.count = count;
      },

      getCount: function () {
        return this.context.count;
      },

      setMenu: function (open) {
        this.context.openMenu = open;
      },

      getMenuState: function () {
        return this.context.openMenu;
      },

      setPager: function (showPager) {
        this.context.pager = showPager;
      },

      getPager: function () {
        return this.context.pager;
      },

      setDiscoverCommunities: function (arr) {
        this.context.discoveryCommunities = arr;
      },

      getDiscoverCommunities: function () {
        return this.context.discoveryCommunities;
      },
      
      setDiscoveryContext: function(context) {
        this.context.discoveryContext = context;
      },
      
      getDiscoveryContext: function() {
        return this.context.discoveryContext;
      }

    };
  });

})();
