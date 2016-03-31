/**
 * Created by mspalti on 3/30/16.
 */
/**
 * Created by mspalti on 2/25/16.
 */

'use strict';

(function () {

  /**
   * Item component controller.
   */

  /*globals dspaceControllers*/

  function DialogItemCtrl(QueryManager, ItemById) {
  }

  dspaceComponents.component('dialogItemComponent', {
    bindings: {
      data: '<'
    },
    templateUrl: '/handle/templates/dialogItem.html',
    controller: DialogItemCtrl

  });

})();





