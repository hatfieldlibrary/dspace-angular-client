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
                        DiscoveryContext,
                        AppContext,
                        Utils,
                        Messages,
                        DiscoveryFormUtils) {

    var disc = this;

    /**
     * Set this to be the controller updated by the discovery util methods.
     */
    DiscoveryFormUtils.setController(this);

    /**
     * Array containing list of communities.
     * @type {Array}
     */
    disc.searchItems = [];

    /**
     * Array containing list of collections within a community.
     * @type {Array}
     */
    disc.collections = [];

    disc.pageHeader = Messages.DISCOVERY_PAGE_HEADER;

    disc.communityLabel = Messages.ADVANCED_SEARCH_COMMUNITY_LABEL;

    disc.collectionLabel = Messages.ADVANCED_SEARCH_COLLECTION_LABEL;

    disc.textLabel = Messages.ADVANCED_SEARCH_TEXT_LABEL;

    disc.submitLabel = Messages.ADVANCED_SEARCH_SUBMIT_LABEL;


    /**
     * Handles collection selection.
     * @param id
     */
    disc.selectCollection = function(id) {
      DiscoveryFormUtils.selectCollection(id);
    };


    /**
     * Handles selection of community.
     */

    disc.selectCommunity = function() {
      DiscoveryFormUtils.selectCommunity();
    };

    /**
     * Handles search form submission.
     * @param terms  the query terms
     */
    disc.submit = function (terms) {

      var type = 'all';
      var id = 0;

      disc.showHints = false;

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
        $location.path('/ds/discover/' + type + '/' + id + '/' + terms);
      }

    };

    function init() {

      disc.showHints = true;

      Utils.resetQuerySettings();

      /**
       * Input route parameters.
       */
      disc.type = $routeParams.type;
      var id = $routeParams.id;
      disc.terms = $routeParams.terms;

      /**
       * Remove any previous discovery filters.
       */
      QueryManager.clearDiscoveryFilters();

      /**
       * Normal initialization.
       */
      QueryManager.setAssetType(disc.type);

      QueryManager.setQueryType(QueryTypes.DISCOVER);

      QueryManager.setAction(QueryActions.SEARCH);

      QueryManager.setSort(QuerySort.ASCENDING);

      QueryManager.setSearchTerms(disc.terms);

      AppContext.setDiscoveryContext(DiscoveryContext.BASIC_SEARCH);

      QueryStack.clear();

      disc.hideComponents = false;

      /**
       * If the DSpace ID parameter is undefined then hide unnecessary
       * components and set this initial id to zero ('All Departments').
       */
      if (id === undefined) {
        disc.hideComponents = true;
        id = 0;
      }

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
        DiscoveryFormUtils.getCommunities();
        /**
         * Get the parent community info.
         */
        DiscoveryFormUtils.getCommunityParentInfo(id);
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
        DiscoveryFormUtils.getCommunities();
        /**
         * Get list of collections for this community.
         */
        if (disc.communityId !== 0) {
          DiscoveryFormUtils.getCollectionsForCommunity(disc.communityId);
        }
      }


    }

    init();

  }

  dspaceComponents.component('discoverComponent', {

    templateUrl: '/ds/discover/templates/discover.html',
    controller: DiscoverCtrl,
    controllerAs: 'disc'

  });

})();
