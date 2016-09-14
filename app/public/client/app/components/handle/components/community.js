/**
 * Created by mspalti on 2/25/16.
 */

'use strict';

(function () {

  /**
   * Community view controller.
   */

  function CommunityCtrl($mdMedia,
                         Messages,
                         Utils,
                         AppContext,
                         PageTitle,
                         PageDescription,
                         PageAuthor,
                         SeoPaging,
                         $scope) {

    var ctrl = this;

    ctrl.isMobile = true;
    if ($mdMedia('gt-md')) {
      ctrl.isMobile = false;
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
     * Initialize login message to be hidden.
     * @type {boolean}
     */
    ctrl.hideLoginMessage = true;


    /**
     * Watch for updates to the DSpace session status and show
     * or hide the login message in response. We don't want to
     * show the community's inline login component if the user
     * is already logged in.  In that case, we can safely assume
     * that the user does not have access to collections still
     * hidden behind DSpace authorizations.
     */
    $scope.$watch(function () {
        return AppContext.hasDspaceSession();
      },
      function (newValue, oldValue) {
        if (newValue !== oldValue) {
          ctrl.hideLoginMessage = newValue;
        }
      });

    /**
     * Shows login message if the count of returned collections
     * does not equal the total collections in the community.
     * Will ignore count if the user has already logged in.
     */
    function showLoginMessage(dspaceTokenExists) {

      if (!dspaceTokenExists) {
        if (ctrl.data.countItems !== ctrl.data.itemTotal) {
          ctrl.hideLoginMessage = false;

        }
      }
    }

    function init() {

      PageTitle.setTitle(ctrl.data.name);
      PageDescription.setDescription(ctrl.data.introductoryText);
      PageAuthor.setAuthor('');


      SeoPaging.setNextLink('nofollow', '');
      SeoPaging.setPrevLink('nofollow', '');

      Utils.checkStatus(showLoginMessage);

    }

    init();

  }

  dspaceComponents.component('communityComponent', {

    bindings: {
      data: '<'
    },
    templateUrl: '/ds/handle/templates/community.html',
    controller: CommunityCtrl

  });


})();




