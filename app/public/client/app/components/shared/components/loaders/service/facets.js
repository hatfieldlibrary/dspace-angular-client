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

        reverseAuthorList: function (order) {
          var setSize = AppContext.getSetSize();

          var data = {};
          data.count = AppContext.getAuthorsCount();
          var end = Utils.getPageListCount(data.count, setSize);
          // toggle order if necessary
          if (order !== AppContext.getAuthorsOrder()) {
            AppContext.reverseAuthorList();
            AppContext.setAuthorsOrder(order);
          }
          data.results = arraySlice(QueryTypes.AUTHOR_FACETS, QueryManager.getOffset(), QueryManager.getOffset() + end);
          return data;

        },
        reverseSubjectList: function (order) {
          var setSize = AppContext.getSetSize();
          var data = {};
          data.count = AppContext.getSubjectsCount();
          var end = Utils.getPageListCount(data.count, setSize);
          // toggle order if necessary.
          if (order !== AppContext.getSubjectsOrder()) {
            AppContext.reverseSubjectList();
            AppContext.setSubjectsOrder(order);
          }
          data.results = arraySlice(QueryTypes.SUBJECT_FACETS, QueryManager.getOffset(), QueryManager.getOffset() + end);
          return data;

        },
        getAuthorList: function () {
          var setSize = AppContext.getSetSize();

          var data = {};
          data.count = AppContext.getAuthorsCount();
          var end = Utils.getPageListCount(data.count, setSize);
          data.results = arraySlice(QueryTypes.AUTHOR_FACETS, QueryManager.getOffset(), QueryManager.getOffset() + end);
          return data;

        },
        getSubjectList: function () {
          var setSize = AppContext.getSetSize();

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
        }

      };
    }]);
})();
