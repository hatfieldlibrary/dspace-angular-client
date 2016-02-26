/**
 * Created by mspalti on 2/25/16.
 */


'use strict';

(function () {

  /**
   * Collection view controller.
   */

  /*globals dspaceControllers*/

  function CommunitiesCtrl(GetCommunities) {

    var ctrl = this;

    var fetch = GetCommunities.query();
    fetch.$promise.then(function (data) {
      ctrl.communities = data;
    });

  }


  dspaceComponents.component('communitiesComponent', {

    templateUrl: '/app/communities/templates/communities.html',
    controller: CommunitiesCtrl

  });


})();



