/**
 * Created by mspalti on 2/25/16.
 */

(function () {

  function CollectionItemController() {

  }


  dspaceComponents.component('collectionItemComponent', {

    bindings: {
      name: '@',
      shortDescription: '@',
      handle: '@'

    },
    controller: CollectionItemController,
    template: '<div><h4><a href="handle/{{$ctrl.handle}}">{{$ctrl.name}}</a></h4><div ng-bind-html="$ctrl.shortDescription"></div></div>'

  });

})();
