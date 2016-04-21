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

    var disc = this;

    disc.searchItems = [];
    disc.collections = [];


    /**
     * Handles selection of a collection.
     */
    disc.selectCollection = function (id) {

      /**
       * If the collection id is zero, the asset type
       * becomes COMMUNITY. Otherwise, the asset type
       * is COLLECTION.
       */
      if (id === 0) {


        QueryManager.setAssetType(AssetTypes.COMMUNITY);
        QueryManager.setAssetId(disc.communityId);

      }  else {

        QueryManager.setAssetType(AssetTypes.COLLECTION);
        /**
         * Set the asset id to the id of the collection.
         */
        QueryManager.setAssetId(disc.collectionId);
      }

    };

    /**
     * Handles selection of community.
     */
    disc.selectCommunity = function () {

      QueryManager.setAssetId(disc.communityId);
      QueryManager.setAssetType(AssetTypes.COMMUNITY);
      /**
       * Get new collections list for this community.
       */
      getCollectionsForCommunity(disc.communityId);

    };

    /**
     * Handles search form submission.
     * @param terms  the query terms
     */
    disc.submit = function (terms) {

      var type = 'all';
      var id = 0;

      /**
       * Community search.
       */
      if (QueryManager.getAssetType() === AssetTypes.COLLECTION) {

        type = AssetTypes.COLLECTION;
        QueryManager.setAssetType(type);
        QueryManager.setAssetId(disc.collectionId);
        id = disc.collectionId;

      }
      /**
       * Collection search.
       */
      else {

        type = AssetTypes.COMMUNITY;
        QueryManager.setAssetType(type);
        QueryManager.setAssetId(disc.communityId);
        id = disc.communityId;

      }

      /**
       * If search terms are provided, execute the search.
       */
      if (terms.length > 0) {
        $location.path('/discover/' + type + '/' + id + '/' + terms);
      }

    };

    function init() {

      disc.type = $routeParams.type;
      var id = $routeParams.id;
      disc.terms = $routeParams.terms;

      QueryManager.clearDiscoveryFilters();


      QueryManager.setAssetType(disc.type);

      QueryManager.setQueryType(QueryTypes.DISCOVER);

      QueryManager.setAction(QueryActions.SEARCH);

      QueryManager.setSort(QuerySort.ASCENDING);

      QueryManager.setSearchTerms(disc.terms);

      QueryManager.clearDiscoveryFilters();

      QueryManager.setOffset(0);

      QueryStack.clear();

      /**
       * Initialize the search component with collection
       * and community information.
       */
      if (disc.type === AssetTypes.COLLECTION) {
        /**
         * Set collection id on the component scope.
         */
        disc.collectionId = id;
        /**
         * The asset id is the id of the collection.
         */
        QueryManager.setAssetId(id);
        /**
         * Initialize communities list if not already
         * available in app context.
         */
        getCommunities();
        /**
         * Get the parent community info.
         */
        getCommunityParentInfo(id);
      }
      else {
        /**
         * If community query, set the collection id to zero.
         * @type {number}
         */
        disc.collectionId = 0;
        /**
         * Set the community id on the component scope.
         */
        disc.communityId = id;
        /**
         * The asset id is the id of the community.
         */
        QueryManager.setAssetId(id);
        /**
         * Initialize communities list if not already
         * available in app context.
         */
        getCommunities();
        /**
         * Get list of collections for this community.
         */
        if (disc.communityId !== 0) {
          getCollectionsForCommunity(disc.communityId);
        }
      }


    }

    init();


    /**
     * Retrieves parent community information for collection
     * and updates component scope.
     * @param id  the community id
     */
    function getCommunityParentInfo(id) {
      if (id !== 0) {
        var info = GetCollectionInfo.query({item: id});
        info.$promise.then(function (data) {
          disc.communityId = data.parentCommunity.id;
          getCollectionsForCommunity(data.parentCommunity.id);
        });
      }
    }

    /**
     * Retrieves list of communities if not already available
     * in the application context. Adds community list to the
     * component scope.
     */
    function getCommunities() {

      if (AppContext.getDiscoverCommunities().length === 0) {

        var items = GetCommunities.query();
        items.$promise.then(function (data) {
          data.unshift({id: "0", name: "All Departments"});
          AppContext.setDiscoverCommunities(data);
          disc.searchItems = data;

        });

      }
      else {
        disc.searchItems = AppContext.getDiscoverCommunities();
      }

    }

    /**
     * Gets list of collections for a community.  Adds collection
     * list to the component scope.
     * @param id  the community id
     */
    function getCollectionsForCommunity(id) {

      if (id !== 0) {
        var collections = GetCollectionsForCommunity.query({id: id});
        collections.$promise.then(function (data) {
          data.unshift({id: 0, name: 'All Collections'});
          disc.collections = data;

        });
      }

    }

  }

  dspaceComponents.component('discoverComponent', {

    templateUrl: '/discover/templates/discover.html',
    controller: DiscoverCtrl,
    controllerAs: 'disc'

  });

})();
