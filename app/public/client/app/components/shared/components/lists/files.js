/**
 * Created by mspalti on 4/29/16.
 */

'use strict';

(function () {

  /**
   * Item component controller.
   */

  function FilesController($mdMedia, Messages) {

    var ctrl = this;

    ctrl.downloadLabel = Messages.FILE_DOWNLOAD;

    ctrl.isDesktop = $mdMedia('gt-sm');

    ctrl.setTarget = function (type) {

      if (type === 'application/pdf') {
        return '_blank';
      } else if (type === 'text/plain') {
        return '_blank';
      }
      return '_top';
    };


  }

  dspaceComponents.component('filesListComponent', {

    bindings: {
      streams: '<'
    },
    templateUrl: '/ds/shared/templates/lists/filesList.html',
    controller: FilesController

  });

})();
