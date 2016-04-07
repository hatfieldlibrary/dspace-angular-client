/**
 * Created by mspalti on 2/25/16.
 */

'use strict';

(function () {

  /**
   * Community view controller.
   */

  /*globals dspaceControllers*/

  function CommunityCtrl(QueryStack) {

    var ctrl = this;

    QueryStack.clear();

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
      data: '<'
    },
    templateUrl: '/handle/templates/community.html',
    controller: CommunityCtrl

  });


})();




