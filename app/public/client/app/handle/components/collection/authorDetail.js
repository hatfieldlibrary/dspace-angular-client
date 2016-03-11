/**
 * Created by mspalti on 3/1/16.
 */

(function () {

  function AuthorDetailController(QueryManager) {

    var ctrl = this;
    ctrl.offset =  QueryManager.getCurrentOffset();

  }


  dspaceComponents.component('authorDetailComponent', {

    bindings: {
      type: '@',
      id: '@',
      field: '@',
      author: '@',
      count: '@'

    },
    controller: AuthorDetailController,
    // requires new route and new controller to gather in the parameters.  Should be able to use the existing solr model.
    template: '<div><h4><a ng-href="/browse/{{$ctrl.type}}/{{$ctrl.id}}/{{$ctrl.field}}/{{$ctrl.author}}/{{$ctrl.offset}}" target="_top">{{$ctrl.author}} ({{$ctrl.count}})</a></h4></div>'

  });

})();
