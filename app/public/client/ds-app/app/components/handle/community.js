/**
 * Created by mspalti on 2/25/16.
 */

(function () {

  'use strict';

  /**
   * Community view controller.
   */

  function CommunityCtrl($mdMedia,
                         $anchorScroll,
                         Messages,
                         Utils,
                         PageTitle,
                         PageDescription,
                         PageAuthor,
                         SeoPaging,
                         SessionObserver) {

    var ctrl = this;

    ctrl.divLabel = Messages.COLLECTION_DIVIDER_LABEL;

    ctrl.isMobile = true;
    if ($mdMedia('gt-sm')) {
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


    ctrl.hideLoginMessage = SessionObserver.get();
    var subscription = SessionObserver.subscribe(function (state) {

      ctrl.hideLoginMessage = showLoginMessage(state);

    });

    ctrl.$onDestroy = function () {
      subscription.dispose();
    };


    /**
     * Shows login message if the count of returned collections
     * does not equal the total collections in the community.
     * Will ignore count if the user has already logged in.
     */
    function showLoginMessage(dspaceTokenExists) {

      if (!dspaceTokenExists) {
        if (ctrl.data.countItems !== ctrl.data.itemTotal) {
          return false;

        }  else {
          return true;
        }
      }
      else {
        return true;
      }
    }

    ctrl.$onInit = function() {

      $anchorScroll();

      try {
        PageTitle.setTitle(ctrl.data.name);
        PageDescription.setDescription(ctrl.data.introductoryText);

      } catch(error) {
        console.log(error);

      }

      PageAuthor.setAuthor('');


      SeoPaging.setNextLink('nofollow', '');
      SeoPaging.setPrevLink('nofollow', '');

      Utils.checkStatus(showLoginMessage);

    };



  }

  dspaceComponents.component('communityComponent', {

    bindings: {
      data: '<'
    },
    templateUrl: ['AppContext', function (AppContext) {
      return'/' + AppContext.getApplicationPrefix() + '-app/app/templates/handle/community.html';
    }],
    controller: CommunityCtrl

  });


})();




