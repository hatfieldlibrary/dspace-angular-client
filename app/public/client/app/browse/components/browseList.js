/**
 * Created by mspalti on 3/2/16.
 */

(function() {

  function BrowseListCtrl(QueryManager, QueryActions) {

    var ctrl = this;

    QueryManager.setAction(QueryActions.BROWSE);
    ctrl.action = QueryActions.BROWSE;

    ctrl.onUpdate = function (results, count, field) {

      ctrl.field = field;
      ctrl.items = results;
      ctrl. count = count;

    };

  }

  dspaceComponents.component('browseListComponent', {

    bindings: {
      terms: '@',
      type: '@',
      id: '@',
      field: '@'
    },
    controller: BrowseListCtrl,
    templateUrl: '/app/browse/templates/browseList.html'

  });

})();
