/**
 * Created by mspalti on 4/7/16.
 */

'use strict';

(function () {

  dspaceContext.service('AppContext', function () {

    return {

      context: {
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

        openMenu: false

      },

      getContext: function() {
        return this.context;
      },

      getCurrentIndex: function () {
        return this.context.currentListIndex;
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

      setMenu: function(open) {
        console.log('menu state ' + open)
        this.context.openMenu = open;
      },

      getMenuState: function() {
        return this.context.openMenu;
      }



    }
  });

})();