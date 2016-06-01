/**
 * Created by mspalti on 2/25/16.
 */

'use strict';

(function () {

  /**
   * Collection view controller.
   */
  function CommunitiesCtrl(GetCommunities,
                           QueryStack,
                           QueryManager,
                           AssetTypes,
                           Messages) {

    var ctrl = this;

    ctrl.intro = Messages.COMMUNITIES_LIST_INTRO;

    ctrl.heading = Messages.COMMUNITIES_LIST_HEADING;

    ctrl.ready = false;

    QueryStack.clear();

    QueryManager.setAssetType(AssetTypes.COMMUNITY_LIST);

    var fetch = GetCommunities.query();
    fetch.$promise.then(function (data) {
      ctrl.ready = true;
      ctrl.communities = data;
    }, function (err) {
      console.log('Error status: ' + err.status + ' - ' + err.statusText);
    });


  }


  dspaceComponents.component('communitiesComponent', {

    templateUrl: '/ds/communities/templates/communities.html',
    controller: CommunitiesCtrl

  });


})();



