/**
 * Functions work working with facet arrays.
 * Created by mspalti on 6/29/16.
 */

'use strict';

(function () {

  dspaceServices.factory('FacetHandler', [
    'QueryManager', 'QueryActions', 'QueryTypes', 'AppContext', 'Utils',
    function (QueryManager, QueryActions, QueryTypes, AppContext, Utils) {


      /**
       * Returns values for a range of indices from the author facets array.
       * @param start  the start index
       * @param end    the end index
       * @returns {Array}
       */
      function arraySlice(type, start, end) {

        //var setSize = AppContext.getSetSize();

        // if (end < setSize) {
        //   setSize = end;
        //
        // }
        try {
          var arr = [];

          if (type === QueryTypes.AUTHOR_FACETS) {
            arr = AppContext.getAuthors().slice(start, end);
          } else if (type === QueryTypes.SUBJECT_FACETS) {
            arr = AppContext.getSubjects().slice(start, end);
          }

          var data = new Array(arr.length);
          var arraySize = end - start;
          for (var i = 0; i < arraySize; i++) {
            data[i] = {item: arr[i]};
          }
          return data;

        } catch (err) {
          console.log(err);
        }

      }

      return {
        /**
         *  Set the author facet list order.
         *  The order will be changed if the context differs from the order provided in the
         *  current query. If the order is changed, it will be updated in the context as well.
         *  @param order
         */
        setAuthorListOrder: function (order) {

          if (order !== QueryManager.getSort()) {
            AppContext.reverseAuthorList();
            AppContext.setAuthorsOrder(order);
          }

        },
        /**
         *  Set the subject facet list order.
         *  The order will be changed if the context differs from the order provided in the
         *  current query. If the order is changed, it will be updated in the context as well.
         *  @param order
         */
        setSubjectListOrder: function (order) {

          if (order !== QueryManager.getSort()) {
            console.log('reversing order')
            AppContext.reverseSubjectList();
            AppContext.setSubjectsOrder(order);
          }

        },
        getAuthorListSlice: function () {
          var setSize = AppContext.getSetSize();
          var data = {};
          data.count = AppContext.getAuthorsCount();
          var end = Utils.getPageListCount(data.count, setSize);
          data.results = arraySlice(QueryTypes.AUTHOR_FACETS, QueryManager.getOffset(), QueryManager.getOffset() + end);
          return data;

        },
        getSubjectListSlice: function (setSize) {
          //var setSize = AppContext.getSetSize();
          console.log(setSize)
          var data = {};
          data.count = AppContext.getSubjectsCount();
          var end = Utils.getPageListCount(data.count, setSize);
          data.results = arraySlice(QueryTypes.SUBJECT_FACETS, QueryManager.getOffset(), QueryManager.getOffset() + end);
          return data;

        },
        checkForListAction: function () {

          if (QueryManager.isSubjectListRequest || QueryManager.isAuthorListRequest) {
            QueryManager.setAction(QueryActions.LIST);
          }
        }, /**
         * Traverses a provided array and returns the index of the
         * first element that matches a case-insensitive regex that
         * looks for the letters at the beginning of each line.
         * @param arr   the input array
         * @param letters  the characters to match
         * @returns {number} the array index
         */
        findIndexInArray: function (arr, letters) {

          if (letters.length > 0) {
            var regex = new RegExp('^' + letters, 'i');
            for (var i = 0; i < arr.length; i++) {
              if (arr[i].value.match(regex) !== null) {
                return i;
              }
            }
          }
          return 0;
        }

      };
    }]);
})();
