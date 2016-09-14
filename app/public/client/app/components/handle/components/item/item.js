/**
 * Item component controller.
 * Created by mspalti on 2/25/16.
 */

'use strict';

(function () {


  function ItemCtrl(GetCollectionInfo,
                    Utils,
                    Messages,
                    AppContext,
                    PageTitle,
                    PageDescription,
                    PageAuthor,
                    SeoPaging) {

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

    ctrl.showMetadata = false;

    ctrl.toggleMeta = function () {
      ctrl.showMetadata = !ctrl.showMetadata;

    };
    /**
     * Get information about the item.
     */
    ctrl.data.$promise.then(function (data) {

      ctrl.fileCount = Utils.getFileCount(ctrl.data.bitstreams);
      ctrl.canWrite = AppContext.getWritePermission();
      ctrl.itemId = data.id;

      SeoPaging.setNextLink('nofollow', '');
      SeoPaging.setPrevLink('nofollow', '');

      PageTitle.setTitle(data.name);
      PageAuthor.setAuthor(data.author);
      PageDescription.setDescription(data.description);

    });

    /**
     * Retrieve parent collection name and handle.
     */
    var parent = GetCollectionInfo.query({item: ctrl.data.parentCollection.id});
    parent.$promise.then(function (data) {
      ctrl.parentName = data.parentCommunity.name;
      ctrl.parentHandle = data.parentCommunity.handle;
    });

  }

  dspaceComponents.component('itemComponent', {

    bindings: {
      data: '<'
    },
    templateUrl: '/ds/handle/templates/item/item.html',
    controller: ItemCtrl

  });

})();





