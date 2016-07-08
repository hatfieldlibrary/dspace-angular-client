/**
 * Functions work working with facet arrays.
 * Created by mspalti on 6/29/16.
 */

'use strict';

(function () {

  dspaceServices.factory('FacetHandler', [
    'QueryManager', 'QueryActions', 'AppContext', 'Utils',
    function (QueryManager, QueryActions, AppContext, Utils) {

      var setSize = AppContext.getSetSize();

      return {
        reverseAuthorList: function (order) {
          if (order !== AppContext.getAuthorsOrder()) {
            AppContext.reverseAuthorList();
          }
          AppContext.setAuthorsOrder(order);
          var data = {};
          data.count = AppContext.getAuthorsCount();
          var end = Utils.getPageListCount(data.count, setSize);
          data.results = Utils.authorArraySlice(QueryManager.getOffset(), QueryManager.getOffset() + end);
          return data;
        },
        reverseSubjectList: function (order) {

          if (order !== AppContext.getSubjectsOrder()) {
            AppContext.reverseSubjectList();
          }
          AppContext.setSubjectsOrder(order);
          var data = {};
          data.count = AppContext.getSubjectsCount();
          var end = Utils.getPageListCount(data.count, setSize);
          data.results = Utils.subjectArraySlice(QueryManager.getOffset(), QueryManager.getOffset() + end);
          return data;
        },
        getAuthorList: function() {
          var data = {};
          data.count = AppContext.getAuthorsCount();
          var end = Utils.getPageListCount(data.count, setSize);
          data.results = Utils.authorArraySlice(QueryManager.getOffset(), QueryManager.getOffset() + end);
          return data;
        },
        getSubjectList: function() {
          var data = {};
          data.count = AppContext.getSubjectsCount();
          var end = Utils.getPageListCount(data.count, setSize);
          data.results = Utils.subjectArraySlice(QueryManager.getOffset(), QueryManager.getOffset() + end);
          return data;
        },
        checkForListAction: function() {
           if (QueryManager.isSubjectListRequest || QueryManager.isAuthorListRequest) {
             QueryManager.setAction(QueryActions.LIST);
           }
        }

      }
    }]);
})();
