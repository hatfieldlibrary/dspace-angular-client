/**
 * Created by mspalti on 2/25/16.
 */

'use strict';

(function () {

  /**
   * Item component controller.
   */

  function ItemCtrl(GetCollectionInfo, Utils, Messages, AppContext, QueryManager) {

    var ctrl = this;

    ctrl.pageHeader = Messages.ITEM_DIALOG_HEADER;

    ctrl.filesLabel = Messages.ITEM_FILES_LABEL;

    ctrl.publicationLabel = Messages.ITEM_PUBLICATION_DATE_LABEL;

    ctrl.citationLabel = Messages.ITEM_CITATION_LABEL;

    ctrl.abstractLabel = Messages.ITEM_ABSTRACT_LABEL;

    ctrl.metadataLabel = Messages.ITEM_METADATA_LABEL;

    ctrl.editItemLabel = Messages.ITEM_EDIT_LABEL;

    ctrl.fileAccessLabel = Messages.FILE_ACCESS_RESTRICTED_LABEL;

    ctrl.dspaceHost = AppContext.getDspaceHost();

    ctrl.dspaceRoot = AppContext.getDspaceRoot();


    /**
     * Get information about the item.
     */
    ctrl.data.$promise.then(function (data) {

      console.log(QueryManager.getAssetId());
      console.log(data);
      ctrl.fileCount = Utils.getFileCount(ctrl.data.bitstreams);
      ctrl.canWrite = AppContext.getWritePermission();
      ctrl.itemId = data.id;
    });
    

    ctrl.showMetadata = false;

    var parent = GetCollectionInfo.query({item: ctrl.data.parentCollection.id});

    parent.$promise.then(function (data) {
      ctrl.parentName = data.parentCommunity.name;
      ctrl.parentHandle = data.parentCommunity.handle;
    });

    ctrl.toggleMeta = function () {

      ctrl.showMetadata = !ctrl.showMetadata;

    };


  }

  dspaceComponents.component('itemComponent', {

    bindings: {
      data: '<'
    },
    templateUrl: '/ds/handle/templates/item/item.html',
    controller: ItemCtrl

  });

})();





