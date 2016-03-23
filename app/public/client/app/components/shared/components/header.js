/**
 * Created by mspalti on 3/23/16.
 */

'use strict';

(function () {

  function HeaderCtrl() {
  }


  dspaceComponents.component('headerComponent', {

    bindings: {
      department: '@',
      collection: '@',
      type: '@',
      id: '@'
    },
    templateUrl: '/shared/templates/header.html',
    controller: HeaderCtrl

  });


})();
