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
    
    
  }

  dspaceComponents.component('itemComponent', {

    bindings: {
      data: '<'
    },
    templateUrl: '/handle/templates/item.html',
    controller: ItemCtrl

  });

})();





