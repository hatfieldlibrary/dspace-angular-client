/**
 * Created by mspalti on 10/6/16.
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


  dspaceComponents.component('browseContainerComponent',
    {
      templateUrl:'/ds/browse/browseContainer.html',
      controller: ContainerController
    });

})();
