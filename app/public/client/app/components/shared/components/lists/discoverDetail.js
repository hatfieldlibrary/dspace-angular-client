/**
 * Created by mspalti on 3/4/16.
 */

'use strict';

(function() {

  function DiscoverDetailCtrl() {

  }

  dspaceComponents.component('discoverDetailComponent', {

    bindings: {
      title: '@',
      description: '<',
      count: '@'
    },
    templateUrl: '/shared/templates/lists/discoverDetail.html',
    controller: DiscoverDetailCtrl
  })

})();
