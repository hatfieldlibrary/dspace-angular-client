/**
 * Created by mspalti on 2/24/16.
 */

'use strict';

(function () {

  /**
   * Collection view controller.
   */

  /*globals dspaceControllers*/

  function CollectionCtrl(QueryManager, QueryActions) {

    var ctrl = this;

    // list action
    QueryManager.setAction(QueryActions.LIST);
    // item type (collection, community,item) from handle request
    QueryManager.setAssetType(ctrl.type);
    // DSpace ID from handle request
    QueryManager.setAssetId(ctrl.id);


    /**
     * Returns the url for a logo.  This method can be called
     * for communities and collections.
     * @returns {string}
     */
    ctrl.getLogo = function () {
      //  if (Data.root.logo.retrieveLink) {
      //     GetLogoPath(Data.root.logo.id);
      //  }
    };

  }

  dspaceComponents.component('collectionComponent', {

    bindings: {
      // API handle query response
      data: '<',
      // asset type
      type: '@',
      // asset id
      id: '@'
    },
    templateUrl: '/handle/templates/collection.html',
    controller: CollectionCtrl

  });


})();



