/**
 * Created by mspalti on 4/13/16.
 */
'use strict';

(function () {

  function CollectionItemCtrl($location) {

    var ctrl = this;

    ctrl.openCollectionHandle = function(handle) {
      $location.path('/ds/handle/' + handle);
    };

  }

  dspaceComponents.component('collectionItemComponent', {

    bindings: {
      title: '@',
      handle: '@',
      description: '@',
      last: '=',
      id: '@'
    },
    templateUrl: '/ds/shared/lists/collectionItem.html',
    controller: CollectionItemCtrl

  });


})();
