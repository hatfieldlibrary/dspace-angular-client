/**
 * Created by mspalti on 2/25/16.
 */

'use strict';

(function () {

  /**
   * Item component controller.
   */

  /*globals dspaceControllers*/

  function ItemCtrl() {
    var ctrl = this;
    console.log(ctrl.type);
  }

  dspaceComponents.component('itemComponent', {

    bindings: {
      data: '<',
      // asset type
      type: '@',
      // asset id
      id: '@'
    },
    templateUrl: '/handle/templates/item.html',
    controller: ItemCtrl

  });

})();





