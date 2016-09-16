/**
 * Created by mspalti on 9/15/16.
 */

'use strict';

(function() {

  function ItemCtrl($mdMedia) {

    var ctrl = this;

    if ($mdMedia('gt-sm')) {
       ctrl.isMobile = false;
    } else {
      ctrl.isMobile = true;
    }


  }

  dspaceComponents.component('itemComponent', {

    bindings: {
      data: '<'
    },
    templateUrl: '/ds/handle/templates/item/selector.html',
    controller: ItemCtrl

  });


})();


