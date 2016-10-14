/**
 * Created by mspalti on 4/13/16.
 */

(function () {

  'use strict';

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
    templateUrl: ['AppContext', function (AppContext) {
      return'/' + AppContext.getApplicationPrefix() + '-app/app/templates/shared/lists/collectionItem.html';
    }],
    controller: CollectionItemCtrl

  });


})();
