/**
 * Created by mspalti on 9/15/16.
 */

(function() {

  'use strict';

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
    templateUrl: ['AppContext', function (AppContext) {
      return'/' + AppContext.getApplicationPrefix() + '-app/app/templates/handle/item/selector.html';
    }],
    controller: ItemCtrl

  });


})();


