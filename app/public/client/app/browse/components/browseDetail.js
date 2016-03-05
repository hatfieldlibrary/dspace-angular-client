/**
 * Created by mspalti on 3/2/16.
 */

'use strict';

(function () {

  function BrowseDetailCtrl() {

    var ctrl = this;


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
    templateUrl: '/app/browse/templates/browseDetail.html',
    controller: BrowseDetailCtrl

  });



})();

