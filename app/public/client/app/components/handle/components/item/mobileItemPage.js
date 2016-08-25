/**
 * Item component controller.
 * Created by mspalti on 2/25/16.
 */

'use strict';

(function () {


  function MobileItemCtrl($window,
                          ItemById,
                          Messages,
                          AppContext,
                          PageTitle) {

    var ctrl = this;

    ctrl.pageHeader = Messages.ITEM_DIALOG_HEADER;

    ctrl.filesLabel = Messages.ITEM_FILES_LABEL;

    ctrl.publicationLabel = Messages.ITEM_PUBLICATION_DATE_LABEL;

    ctrl.citationLabel = Messages.ITEM_CITATION_LABEL;

    ctrl.abstractLabel = Messages.ITEM_ABSTRACT_LABEL;

    ctrl.metadataLabel = Messages.ITEM_METADATA_LABEL;

    ctrl.editItemLabel = Messages.ITEM_EDIT_LABEL;

    ctrl.fileAccessLabel = Messages.FILE_ACCESS_RESTRICTED_LABEL;

    ctrl.parentCollectionLabel = Messages.PARENT_COLLECTION_LABEL;

    ctrl.dspaceHost = AppContext.getDspaceHost();

    ctrl.dspaceRoot = AppContext.getDspaceRoot();

    ctrl.showMetadata = false;


    ctrl.toggleMeta = function () {
      ctrl.showMetadata = !ctrl.showMetadata;

    };

    ctrl.openCollection = function () {

      var collection = '/ds/handle/' + ctrl.collectionHandle;
      $window.location.href = collection;

    };

    var itemInfo = ItemById.query({item: ctrl.collectionItem});
    itemInfo.$promise.then(function (data) {
      ctrl.data = data;
      PageTitle.setTitle(data.name);
    });


    /**
     * Retrieve parent collection name and handle.
     */
    // var parent = GetCollectionInfo.query({item: ctrl.data.parentCollection.id});
    // parent.$promise.then(function (data) {
    //   ctrl.parentName = data.parentCommunity.name;
    //   ctrl.parentHandle = data.parentCommunity.handle;
    // });

  }

  dspaceComponents.component('mobileItemComponent', {

    bindings: {
      collectionItem: '@',
      collectionHandle: '@'
    },
    templateUrl: '/ds/handle/templates/item/mobileItem.html',
    controller: MobileItemCtrl

  });

})();





