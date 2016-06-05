/**
 * Created by mspalti on 3/2/16.
 */

'use strict';

(function () {

  function BrowseDetailCtrl() {
  }

  dspaceComponents.component('browseDetailComponent', {

    bindings: {
      title: '@',
      author: '<',
      publisher: '@',
      year: '@',
      handle: '@',
      id: '@'
    },
    templateUrl: '/ds/shared/templates/lists/browseDetail.html',
    controller: BrowseDetailCtrl

  });



})();

