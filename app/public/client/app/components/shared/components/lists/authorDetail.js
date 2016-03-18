/**
 * Created by mspalti on 3/1/16.
 */

(function () {

  function AuthorDetailController(QueryManager) {

    var ctrl = this;
    ctrl.offset =  QueryManager.getCurrentOffset();
    console.log(ctrl)

  }


  dspaceComponents.component('authorDetailComponent', {

    bindings: {
      type: '@',
      id: '@',
      author: '@',
      field: '@',
      offset: '@'

    },
    controller: AuthorDetailController,
    // requires new route and new controller to gather in the parameters.  Should be able to use the existing solr model.
    template: '<div><h4><a ng-href="/browse/{{$ctrl.type}}/{{$ctrl.id}}/{{$ctrl.field}}/{{$ctrl.author}}/{{$ctrl.offset}}">{{$ctrl.author}} ({{$ctrl.count}})</a></h4></div>'

  });

})();
