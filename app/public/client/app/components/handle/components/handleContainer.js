/**
 * Created by mspalti on 9/22/16.
 */

'use strict';

(function() {

  function ContainerController(QueryManager, AppContext) {

    var ctrl = this;

    ctrl.assetType = QueryManager.getAssetType();

    ctrl.canWrite = AppContext.getWritePermission();

    ctrl.queryType = QueryManager.getQueryType();

    ctrl.assetId = QueryManager.getAssetId();

    ctrl.setAssetType = function(type) {
        ctrl.assetType = type;
    };

    ctrl.setQueryType = function(type) {
        ctrl.queryType = type;
    };

    ctrl.setWritePermission = function(permission) {
        ctrl.canWrite = permission;
    };

    ctrl.setAssetId = function(id) {
        ctrl.assetId = id;
    };

  }


  dspaceComponents.component('handleContainerComponent',
    {
      templateUrl:'/ds/handle/templates/handleContainer.html',
      controller: ContainerController
    })

})();
