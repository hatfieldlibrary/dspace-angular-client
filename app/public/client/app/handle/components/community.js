/**
 * Created by mspalti on 2/25/16.
 */

'use strict';

(function () {

  /**
   * Community view controller.
   */

  /*globals dspaceControllers*/

  function CommunityCtrl(Utils, Data) {

    var ctrl = this;

    ctrl.item = Data.handle;
    ctrl.type = Utils.getType(Data.handle.type);


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

    templateUrl: '/app/handle/templates/community.html',
    controller: CommunityCtrl

  });


})();




