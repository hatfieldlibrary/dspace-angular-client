/**
 * Created by mspalti on 3/2/16.
 */

'use strict';

(function () {

  function BrowseDetailCtrl(AppContext) {
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
    templateUrl: function (AppContext) {
      return '/' + AppContext.getApplicationPrefix() + '-app/app/templates/shared/lists/browseDetail.html';
    },
    controller: BrowseDetailCtrl

  });



})();

