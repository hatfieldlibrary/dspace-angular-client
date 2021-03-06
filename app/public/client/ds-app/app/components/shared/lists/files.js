/**
 * Created by mspalti on 4/29/16.
 */

(function () {

  'use strict';

  /**
   * Item component controller.
   */

  function FilesController($mdMedia, Messages) {

    var ctrl = this;

    ctrl.downloadLabel = Messages.FILE_DOWNLOAD;

    ctrl.isDesktop = $mdMedia('gt-md');

    ctrl.setTarget = function (type) {

      if (type === 'application/pdf') {
        return '_top';
      } else if (type === 'text/plain') {
        return '_top';
      }
      return '_top';
    };


  }

  dspaceComponents.component('filesListComponent', {

    bindings: {
      streams: '<'
    },
    templateUrl: ['AppContext', function (AppContext) {
      return '/' + AppContext.getApplicationPrefix() + '-app/app/templates/shared/lists/filesList.html';
    }],
    controller: FilesController

  });

})();
