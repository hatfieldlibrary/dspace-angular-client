/**
 * Created by mspalti on 3/1/16.
 */

(function () {

  function AuthorDetailController($scope, QueryManager) {

    var ctrl = this;
    ctrl.offset = 0;

    $scope.context = QueryManager.getContext();

    ctrl.selectedIndex = -1;


    ctrl.setSelectedIndex = function () {
      ctrl.setSelected({index: ctrl.index});

    };


    $scope.$watch(
      "context.currentListIndex",
      function updateSelecteIndex(newValue, oldValue) {
        ctrl.selectedIndex = newValue;
      }
    );

  }


  dspaceComponents.component('authorDetailComponent', {

    bindings: {
      type: '@',
      id: '@',
      author: '@',
      field: '@',
      offset: '@',
      index: '@',
      setSelected: '&'

    },
    controller: AuthorDetailController,
    // requires new route and new controller to gather in the parameters.  Should be able to use the existing solr model.
    templateUrl: '/shared/templates/lists/authorDetail.html'

  });

})();
