/**
 * Created by mspalti on 2/25/16.
 */

'use strict';

(function () {

  /**
   * Collection view controller.
   */
  function CommunitiesCtrl(GetCommunities) {

    var ctrl = this;

    var fetch = GetCommunities.query();
    fetch.$promise.then(function (data) {
      ctrl.communities = data;
    });

  }


  dspaceComponents.component('communitiesComponent', {

    templateUrl: '/communities/templates/communities.html',
    controller: CommunitiesCtrl

  });


})();



