/**
 * Created by mspalti on 3/4/16.
 */

'use strict';

(function() {

  function DiscoverListCtrl() {

    var ctrl = this;

    ctrl.onUpdate = function (results, count, field) {

      ctrl.field = field;
      ctrl.items = results;
      ctrl. count = count;

    };

  }

  dspaceComponents.component('discoverListComponent', {

    bindings: {},
    templateUrl: '/app/discover/templates/discoverList.html',
    controller: DiscoverListCtrl

  });

})();
