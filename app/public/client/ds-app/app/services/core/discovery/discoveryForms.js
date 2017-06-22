/**
 * Created by mspalti on 5/23/16.
 */

(function () {

  'use strict';

  /**
   * This service provides methods for the advanced search and discovery component controllers.
   * We bind the controller to a private variable and update values on the controller itself
   * rather than pass return values.
   */
  dspaceServices.service('DiscoveryFormExtensions',

    function (GetCollectionsForCommunity,
              GetCollectionInfo,
              GetCommunitiesForDiscover,
              AppContext,
              QueryManager,
              AssetTypes) {

      var _ctrl;

      var that = this;

      /**
       * Sets the controller that will be updated by service methods.
       * @param ctrl
       */
      this.setController = function (ctrl) {
        _ctrl = ctrl;
      };

      /**
       * Gets list of collections for a community.
       * @param id  the community id
       */
      this.getCollectionsForCommunity = function (communityId, collectionId) {
        if (communityId !== 0 && communityId !== '0' && communityId !== undefined) {
          var collections = GetCollectionsForCommunity.query({id: communityId});
          collections.$promise.then(function (data) {

            data.unshift({uuid: 0, name: 'All Collections'});
            _ctrl.collections = data;
            that.getSelectedCollection(data, collectionId);

          });
        }

      };

      /**
       * Returns the selected collection by id lookup.
       * @param collections
       * @param id
       * @returns {*}
       */
      this.getSelectedCollection = function (collections, id) {
        if (typeof id === 'undefined') {
          id = 0;
        }
        for (var i = 0, len = collections.length; i < len; i++) {
          /* jshint eqeqeq: false */
          if (collections[i].id == id) {
            _ctrl.selectedCollection = collections[i];
          }
        }
        return -1;
      };

      /**
       * Retrieves parent community id and collections.
       * @param id  the community id
       */
      this.getParentCommunityInfo = function (id) {
        if (id !== 0) {
          var info = GetCollectionInfo.query({item: id});
          info.$promise.then(function (data) {
            console.log(data);
            _ctrl.communityId = data.parentCommunity.id;
            that.getCollectionsForCommunity(data.parentCommunity.id, id);
            
          });
        }
      };


      /**
       * Retrieves list of communities if not already available
       * in the application context.
       */
      this.getCommunities = function () {

        if (AppContext.getDiscoverCommunities().length === 0) {
          var items = GetCommunitiesForDiscover.query();
          items.$promise.then(function (data) {
            data.unshift({uuid: '0', name: 'All Departments'});
            AppContext.setDiscoverCommunities(data);
            _ctrl.communityItems = data;
          });
        }
        else {
          _ctrl.communityItems = AppContext.getDiscoverCommunities();
        }
      };

      /**
       * Updates QueryManager on selection of a collection.
       */
      this.selectCollection = function (id) {

        /**
         * If the collection id is zero, the asset type
         * becomes COMMUNITY. Otherwise, the asset type
         * is COLLECTION.
         */
        if (id === 0) {
          QueryManager.setAssetType(AssetTypes.COMMUNITY);
          QueryManager.setAssetId(_ctrl.communityId);

        } else {
          QueryManager.setAssetType(AssetTypes.COLLECTION);
          /**
           * Set the asset id to the id of the collection.
           */
          QueryManager.setAssetId(id);
        }

      };

      /**
       * Updates QueryManager on selection of a community.
       */
      this.selectCommunity = function () {

        QueryManager.setAssetId(_ctrl.communityId);
        QueryManager.setAssetType(AssetTypes.COMMUNITY);
        _ctrl.collections = [];

      };

    });

})();


