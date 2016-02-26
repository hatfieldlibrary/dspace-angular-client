/**
 * Created by mspalti on 2/23/16.
 */

(function () {

  function ItemDetailController() {
  }


  dspaceComponents.component('listItemDetail', {

    bindings: {
      title: '@',
      author: '<',
      publisher: '@',
      year: '@',
      handle: '@',
      id: '@'

    },
    controller: ItemDetailController,
    template: '<div><h4><a href="/handle/{{$ctrl.handle}}">{{$ctrl.title}}</a></h4> {{$ctrl.author}}, {{$ctrl.publisher}}, {{$ctrl.year}}, {{$ctrl.handle}}, {{$ctrl.id}}</div>'

  });

})();
