/**
 * Created by mspalti on 3/4/16.
 */

'use strict';

(function () {

  function DiscoverCtrl($routeParams,
                        $location,
                        QueryManager,
                        AssetTypes,
                        QueryTypes,
                        QueryActions,
                        QueryStack,
                        QuerySort,
                        AppContext,
                        GetCommunities,
                        GetCollectionInfo,
                        GetCollectionsForCommunity) {

    var sb = this;

    var parent = {};


    sb.searchItems = [];

    sb.selectCommunity = function () {

      if (sb.communityId !== 0) {
        QueryManager.setAssetId(sb.communityId);
      }
      getCollectionsForCommunity(sb.communityId);
    };

    sb.submit = function (terms) {

      var type = 'all';
      var id = 0;

      if (sb.collectionId !== 0) {
        type = AssetTypes.COLLECTION;
        QueryManager.setAssetType(type);
        QueryManager.setAssetId(sb.collectionId);
        id = sb.collectionId;
      } else {
        type = AssetTypes.COMMUNITY;
        QueryManager.setAssetType(type);
        QueryManager.setAssetId(sb.communityId);
        id = sb.communityId;
      }

      if (terms.length > 0) {
        $location.path('/discover/' + type + '/' + id + '/' + terms);
      }

    };

    function init() {

      sb.type = $routeParams.type;
      var id = $routeParams.id;
      sb.terms = $routeParams.terms;


      QueryManager.setAssetType(sb.type);

      QueryManager.setQueryType(QueryTypes.DISCOVER);

      QueryManager.setAction(QueryActions.SEARCH);

      QueryManager.setSort(QuerySort.ASCENDING);

      QueryManager.setSearchTerms(sb.terms);

      QueryStack.clear();

      console.log(sb.type + ' ' + AssetTypes.COLLECTION);

      /**
       * If collection, get the parent community id.
       */
      if (sb.type === AssetTypes.COLLECTION) {

        QueryManager.setAssetId(id);
        sb.collectionId = id;

        getCommunities();
        getCommunityParentInfo(id);
      }
      /**
       * If community, use the provided id.
       */
      else {
        sb.collectionId = 0;
        sb.communityId = id;
        QueryManager.setAssetId(id);
        getCommunities();
        if (sb.communityId !== 0) {
          getCollectionsForCommunity(sb.communityId);
        }
      }


    }

    init();

    function getCommunityParentInfo(id) {
      if (id !== 0) {
        var info = GetCollectionInfo.query({item: id});
        info.$promise.then(function(data) {
          sb.communityId = data.parentCommunity.id;
          getCollectionsForCommunity(data.parentCommunity.id);
        });
      }
    }

    function getCommunities() {

      if (AppContext.getDiscoverCommunities().length === 0) {

        var items = GetCommunities.query();
        items.$promise.then(function (data) {
          data.unshift({id: "0", name: "All Departments"});
          AppContext.setDiscoverCommunities(data);
          sb.searchItems = data;

        });

      }
      else {
        sb.searchItems = AppContext.getDiscoverCommunities();
      }

    }

    function getCollectionsForCommunity(id) {

      if (id !== 0) {
        var collections = GetCollectionsForCommunity.query({id: id});
        collections.$promise.then(function (data) {
          data.unshift({id: 0, name: 'All Collections'});
          sb.collections = data;

        });
      }

    }

    function getCollectionParent(id) {

      if (id !== 0) {
        var info = GetCollectionInfo.query({item: id});
        info.$promise.then(function(data) {
           sb.communityId = data.parentCommunity.id;
        });
      }

    }

  }

  dspaceComponents.component('discoverComponent', {

    templateUrl: '/discover/templates/discover.html',
    controller: DiscoverCtrl,
    controllerAs: 'sb'

  });

})();
