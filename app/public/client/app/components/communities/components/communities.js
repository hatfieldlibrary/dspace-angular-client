/**
 * Communities list component.
 * Created by mspalti on 2/25/16.
 */

'use strict';

(function () {


  function CommunitiesCtrl(GetCommunities,
                           QueryManager,
                           AssetTypes,
                           Messages,
                           PageTitle,
                           PageDescription,
                           PageAuthor,
                           SeoPaging) {

    var ctrl = this;

    ctrl.intro = Messages.COMMUNITIES_LIST_INTRO;

    ctrl.heading = Messages.COMMUNITIES_LIST_HEADING;

    /**
     * Indicates when data has been returned.
     * @type {boolean}
     */
    ctrl.ready = false;

    /**
     * Communities data.
     * @type {{}}
     */
    ctrl.communities = {};

    function _init() {

      SeoPaging.setNextLink('nofollow','');
      SeoPaging.setPrevLink('nofollow','');

      PageAuthor.setAuthor('');
      PageDescription.setDescription(Messages.COMMUNITIES_META_DESCRIPTION);
      PageTitle.setTitle(Messages.COMMUNITIES_META_TITLE);

      QueryManager.setAssetType(AssetTypes.COMMUNITY_LIST);

      var fetch = GetCommunities.query();

      fetch.$promise.then(function (data) {
        ctrl.ready = true;
        ctrl.communities = data;
      }, function (err) {
        console.log('Error status: ' + err.status + ' - ' + err.statusText);
      });

    }

    _init();

  }

  dspaceComponents.component('communitiesComponent', {

    templateUrl: '/ds/communities/templates/communities.html',
    controller: CommunitiesCtrl

  });


})();



