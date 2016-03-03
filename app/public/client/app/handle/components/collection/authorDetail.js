/**
 * Created by mspalti on 3/1/16.
 */

(function () {

  function ItemDetailController() {
  }


  dspaceComponents.component('authorDetailComponent', {

    bindings: {
      type: '@',
      id: '@',
      format: '@',
      author: '@'

    },
    controller: ItemDetailController,
    // requires new route and new controller to gather in the parameters.  Should be able to use the existing solr model.
    template: '<div><h4><a ng-href="/handle/browse/{{$ctrl.type}}/{{$ctrl.id}}/{{$ctrl.format}}/{{$ctrl.author}}">{{$ctrl.author}}</a></h4></div>'

  });

})();
