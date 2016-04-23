/**
 * Created by mspalti on 2/25/16.
 */

'use strict';

(function () {

  /**
   * Item component controller.
   */

  /*globals dspaceControllers*/

  function ItemCtrl($timeout, $anchorScroll) {

    var ctrl = this;

    ctrl.showMetadata = false;

    ctrl.toggleMeta = function () {

    

      // Toggle
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





