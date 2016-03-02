/**
 * Created by mspalti on 3/1/16.
 */

(function () {

  function ItemDetailController() {
  }


  dspaceComponents.component('authorDetailComponent', {

    bindings: {
      author: '@'

    },
    controller: ItemDetailController,
    template: '<div><h4>{{$ctrl.author}}</h4></div>'

  });

})();
