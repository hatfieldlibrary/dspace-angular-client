/**
 * Created by mspalti on 2/25/16.
 */

'use strict';

(function () {

  /**
   * Community view controller.
   */

  function CommunityCtrl(Messages) {

    var ctrl = this;

    ctrl.homeLinkLabel = Messages.COMMUNITY_HOME_LINK_LABEL;
    
    ctrl.loginMessage = Messages.LOGIN_TO_SEE_MORE_LABEL;

    
    if (ctrl.data.countItems === ctrl.data.itemTotal) {
      ctrl.hideLoginMessage = true;
    }

    /**
     * Returns the url for a logo.  This method can be called
     * for communities and collections.
     * @returns {string}
     */
    ctrl.getLogo = function () {
      //  if (Data.root.logo.retrieveLink) {
      //     Utils.getLogoPath(Data.root.logo.id);

      //  }
    };

  }

  dspaceComponents.component('communityComponent', {

    bindings: {
      data: '<'
    },
    templateUrl: '/handle/templates/community.html',
    controller: CommunityCtrl

  });


})();




