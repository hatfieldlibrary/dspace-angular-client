/**
 * Created by mspalti on 3/4/16.
 */

'use strict';

(function() {

  function DiscoverCtrl() {


  }

  dspaceComponents.component('discoverComponent', {

    bindings: {
      terms: '@',
      id: '@',
      offset: '@'
    },
    templateUrl: '/app/discover/templates/discover.html',
    controller: DiscoverCtrl

  });

})();
