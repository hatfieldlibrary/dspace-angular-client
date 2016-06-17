/**
 * Created by mspalti on 2/25/16.
 */

'use strict';

(function () {

  /**
   * Community view controller.
   */

  function CommunityCtrl(Messages, Utils) {

    var ctrl = this;

    ctrl.homeLinkLabel = Messages.COMMUNITY_HOME_LINK_LABEL;

    ctrl.loginMessage = Messages.LOGIN_TO_SEE_MORE_LABEL;

    /**
     * Returns the url for a logo.  This method can be called
     * for communities and collections.
     * @returns {string}
     */
    ctrl.getLogo = getLogo;
    
    ctrl.hasLogo = hasLogo;


    /**
     * Shows login message if the count of returned collections
     * does not equal the total collections in the community.
     * Assumes that some collections have access restrictions.
     */
    if (ctrl.data.countItems === ctrl.data.itemTotal) {

      ctrl.hideLoginMessage = true;

    }

    function hasLogo() {
      if (typeof ctrl.data.logo.retrieveLink !== 'undefined') {
        return true;
      }
      return false;
    }
    
    function getLogo() {

      if (ctrl.data.logo.retrieveLink) {
        return Utils.getLogoPath(ctrl.data.logo.id);
      }
      return '';
    }

  }

  dspaceComponents.component('communityComponent', {

    bindings: {
      data: '<'
    },
    templateUrl: '/ds/handle/templates/community.html',
    controller: CommunityCtrl

  });


})();




