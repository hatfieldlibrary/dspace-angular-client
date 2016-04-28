/**
 * Created by mspalti on 2/25/16.
 */

'use strict';

(function () {

  /**
   * Item component controller.
   */

  /*globals dspaceControllers*/

  function ItemCtrl(GetCollectionInfo) {

    var ctrl = this;

    ctrl.showMetadata = false;

    var parent = GetCollectionInfo.query({item: ctrl.data.parentCollection.id});
    parent.$promise.then(function (data) {
      ctrl.parentName = data.parentCommunity.name;
      ctrl.parentHandle = data.parentCommunity.handle;
    });

    ctrl.toggleMeta = function () {

      ctrl.showMetadata = !ctrl.showMetadata;

    };


  }

  dspaceComponents.component('itemComponent', {

    bindings: {
      data: '<'
    },
    templateUrl: '/handle/templates/item/item.html',
    controller: ItemCtrl

  });

})();





