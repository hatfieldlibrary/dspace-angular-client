/**
 * Created by mspalti on 2/25/16.
 */

'use strict';

(function () {

  /**
   * Collection view controller.
   */
  function CommunitiesCtrl(GetCommunities, QueryStack, Messages) {

    var ctrl = this;
    ctrl.ready = false;
    
    QueryStack.clear();
    
    ctrl.intro = Messages.COMMUNITIES_LIST_INTRO;

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



