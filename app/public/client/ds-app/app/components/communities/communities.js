/**
 * Communities list component.
 * Created by mspalti on 2/25/16.
 */

(function () {

  'use strict';

  function CommunitiesCtrl($mdMedia,
                           AppContext,
                           GetCommunities,
                           QueryManager,
                           AssetTypes,
                           Messages,
                           PageTitle,
                           PageDescription,
                           PageAuthor,
                           SeoPaging) {

    var ctrl = this;

    ctrl.intro = Messages.COMMUNITIES_LIST_INTRO;

    ctrl.headerImage = Messages.COMMUNITIES_HEADER_IMAGE;

    ctrl.divLabel = Messages.COMMUNITY_DIVIDER_LABEL;

    ctrl.showHeaderImage = false;

    ctrl.isMobile = true;

    if ($mdMedia('gt-sm')) {
      ctrl.isMobile = false;
    }

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

      // set header image.
      if (ctrl.headerImage.length > 0) {
        ctrl.showHeaderImage = true;
      }

      SeoPaging.setNextLink('nofollow','');
      SeoPaging.setPrevLink('nofollow','');

      PageAuthor.setAuthor('');
      PageDescription.setDescription(Messages.COMMUNITIES_META_DESCRIPTION);
      PageTitle.setTitle(Messages.COMMUNITIES_META_TITLE);

      QueryManager.setAssetType(AssetTypes.COMMUNITY_LIST);

      // we cache the communities object.
      if (Object.keys(AppContext.getCommunitiesList()).length !== 0) {

        ctrl.ready = true;
        ctrl.communities = AppContext.getCommunitiesList();

      } else {

        var fetch = GetCommunities.query();
        fetch.$promise.then(function (data) {

          ctrl.ready = true;
          ctrl.communities = data;
          AppContext.setCommunitiesList(data);

        }, function (err) {
          console.log('Error status: ' + err.status + ' - ' + err.statusText);
        });

      }

    }

    _init();

  }

  dspaceComponents.component('communitiesComponent', {

    templateUrl: ['AppContext', function (AppContext) {
        return '/' + AppContext.getApplicationPrefix() + '-app/app/templates/communities/communities.html';
      }],
    controller: CommunitiesCtrl

  });


})();



