/**
 * Created by mspalti on 3/11/16.
 */
(function () {

  function SubjectDetailController(QueryManager) {

    var ctrl = this;
    ctrl.offset =  QueryManager.getOffset();


  }


  dspaceComponents.component('subjectDetailComponent', {

    bindings: {
      type: '@',
      id: '@',
      field: '@',
      subject: '@',
      count: '@'

    },
    controller: SubjectDetailController,
    templateUrl: '/shared/templates/lists/subjectDetail.html'
  });

})();
