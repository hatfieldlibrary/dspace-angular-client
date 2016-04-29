/**
 * Created by mspalti on 2/25/16.
 */

'use strict';

(function () {

  /**
   * Item component controller.
   */

  function ItemCtrl(GetCollectionInfo, Utils, Messages) {

    var ctrl = this;

    ctrl.pageHeader = Messages.ITEM_DIALOG_HEADER;

    ctrl.filesLabel = Messages.ITEM_FILES_LABEL;

    ctrl.publicationLabel = Messages.ITEM_PUBLICATION_DATE_LABEL;

    ctrl.citationLabel = Messages.ITEM_CITATION_LABEL;

    ctrl.abstractLabel = Messages.ITEM_ABSTRACT_LABEL;

    ctrl.metadataLabel = Messages.ITEM_METADATA_LABEL;

    /**
     * Get the number of bitstreams for this item.
     */
    ctrl.data.$promise.then(function () {
      ctrl.fileCount = Utils.getFileCount(ctrl.data.bitstreams);
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
    templateUrl: '/handle/templates/item/item.html',
    controller: ItemCtrl

  });

})();





