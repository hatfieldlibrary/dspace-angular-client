/**
 * Created by mspalti on 4/13/16.
 */
'use strict';

(function () {

  function CollectionItemCtrl() {

  }

  dspaceComponents.component('collectionItemComponent', {

    bindings: {
      title: '@',
      handle: '@',
      description: '@',
      last: '=',
      id: '@'
    },
    template:
    '<div layout-padding>' +
    '<div class="md-title">' +
    '<a href="/handle/{{$ctrl.handle}}">{{$ctrl.title}}</a>' +
    '</div>' +
    '<p ng-bind-html="$ctrl.description" class="md-subhead"></p>' +
    '</div>' +
    '<md-divider  ng-if="!$ctrl.last"></md-divider>',
    controller: CollectionItemCtrl

  });


})();
