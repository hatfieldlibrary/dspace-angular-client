/**
 * Created by mspalti on 2/25/16.
 */

'use strict';

(function () {

  /**
   * Collection view controller.
   */
  function CommunitiesCtrl(GetCommunities, QueryStack) {

    var ctrl = this;
    ctrl.ready = false;
    
    QueryStack.clear();

    var fetch = GetCommunities.query();
    fetch.$promise.then(function (data) {
      ctrl.ready = true;
      ctrl.communities = data;
    });

  }


  dspaceComponents.component('communitiesComponent', {

    templateUrl: '/communities/templates/communities.html',
    controller: CommunitiesCtrl

  });


})();



