/**
 * Created by mspalti on 4/29/16.
 */

'use strict';

(function () {

  /**
   * Item component controller.
   */

  function FilesController(Messages) {

    var ctrl = this;

    ctrl.downloadLabel = Messages.FILE_DOWNLOAD;


  }

  dspaceComponents.component('filesListComponent', {

    bindings: {
      streams: '<'
    },
    templateUrl: '/ds/shared/templates/lists/filesList.html',
    controller: FilesController

  });

})();
