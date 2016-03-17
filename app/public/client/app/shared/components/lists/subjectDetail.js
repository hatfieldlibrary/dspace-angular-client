/**
 * Created by mspalti on 3/11/16.
 */
(function () {

  function SubjectDetailController(QueryManager) {

    var ctrl = this;
    ctrl.offset =  QueryManager.getCurrentOffset();


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
    template: '<div><h4><a ng-href="/browse/{{$ctrl.type}}/{{$ctrl.id}}/{{$ctrl.field}}/{{$ctrl.subject}}/{{$ctrl.offset}}">{{$ctrl.subject}} ({{$ctrl.count}})</a></h4></div>'

  });

})();
