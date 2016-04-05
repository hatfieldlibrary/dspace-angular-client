/**
 * Created by mspalti on 3/11/16.
 */
(function () {

  function SubjectDetailController($scope, QueryManager, QueryTypes, InlineBrowseRequest) {

    var ctrl = this;

    $scope.context = QueryManager.getContext();

    ctrl.offset =  QueryManager.getOffset();

    ctrl.selectedIndex = -1;

    ctrl.setSelectedIndex = function () {
      ctrl.setSelected({index: ctrl.index});

    };

    ctrl.getItems = function() {

      var result = InlineBrowseRequest.query(
        {
          type: ctrl.type,
          id: ctrl.id,
          qType: QueryTypes.SUBJECT_SEARCH,
          field: ctrl.field,
          terms: ctrl.subject,
          offset: 0
        }
      );
      result.$promise.then(function (data) {
        console.log(data);
        ctrl.items = data;
      });

    };


    $scope.$watch(
      "context.currentListIndex",
      function updateSelecteIndex(newValue, oldValue) {
        ctrl.selectedIndex = newValue;
      }
    );

  }


  dspaceComponents.component('subjectDetailComponent', {

    bindings: {
      subject: '@',
      count: '@',
      type: '@',
      id: '@',
      index: '@',
      field: '@',
      setSelected: '&'

    },
    controller: SubjectDetailController,
    templateUrl: '/shared/templates/lists/subjectDetail.html'
  });

})();
