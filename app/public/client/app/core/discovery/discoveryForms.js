/**
 * Created by mspalti on 5/23/16.
 */

'use strict';

/**
 * This service provides methods for the advanced search and discovery components.
 * These components dynamically retrieve community and collection information as
 * needed by the search forms.
 */
dspaceServices.service('DiscoveryFormUtils', [

  'GetCollectionsForCommunity',
  'GetCollectionInfo',
  'GetCommunitiesForDiscover',
  'AppContext',

  function (GetCollectionsForCommunity,
            GetCollectionInfo,
            GetCommunitiesForDiscover,
            AppContext) {


    var _ctrl;

    /**
     * Sets the controller that will be updated by service methods.
     * @param ctrl
     */
    this.setController = function (ctrl) {
      _ctrl = ctrl;
    };

    /**
     * Gets list of collections for a community.  Adds collection
     * list to the component scope.
     * @param id  the community id
     */
    this.getCollectionsForCommunity = function (id) {

      if (id !== 0 && id !== '0' && id !== undefined) {
        var collections = GetCollectionsForCommunity.query({id: id});
        collections.$promise.then(function (data) {
          data.unshift({id: 0, name: 'All Collections'});
          _ctrl.collections = data;

        });
      }

    };

    /**
     * Retrieves parent community information for collection
     * and updates component scope.
     * @param id  the community id
     */
    this.getCommunityParentInfo = function (id) {
      if (id !== 0) {
        var info = GetCollectionInfo.query({item: id});
        info.$promise.then(function (data) {
          _ctrl.communityId = data.parentCommunity.id;
          this.getCollectionsForCommunity(data.parentCommunity.id);
        });
      }
    };

    /**
     * Retrieves list of communities if not already available
     * in the application context. Adds community list to the
     * component scope.
     */
    this.getCommunities = function () {

      if (AppContext.getDiscoverCommunities().length === 0) {

        var items = GetCommunitiesForDiscover.query();
        items.$promise.then(function (data) {
          data.unshift({id: '0', name: 'All Departments'});
          AppContext.setDiscoverCommunities(data);
          _ctrl.searchItems = data;

        });
      }
      else {
        _ctrl.searchItems = AppContext.getDiscoverCommunities();
      }
    };


  }]);




