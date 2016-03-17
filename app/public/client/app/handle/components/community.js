/**
 * Created by mspalti on 2/25/16.
 */

'use strict';

(function () {

  /**
   * Community view controller.
   */

  /*globals dspaceControllers*/

  function CommunityCtrl(QueryManager) {

    var ctrl = this;

    // DSpace ID
    QueryManager.setAssetId(ctrl.id);
    // Asset type
    QueryManager.setAssetType(ctrl.type);



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

  dspaceComponents.component('communityComponent', {

    bindings: {
      data: '<',
      // asset type
      type: '@',
      // asset id
      id: '@'
    },
    templateUrl: '/handle/templates/community.html',
    controller: CommunityCtrl

  });


})();




