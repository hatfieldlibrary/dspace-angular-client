/**
 * Created by mspalti on 3/4/16.
 */

'use strict';

(function () {

  function AdvancedCtrl($routeParams,
                        $location,
                        SolrQuery,
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
                        GetCommunitiesForDiscover,
                        GetCollectionInfo,
                        GetCollectionsForCommunity) {

    var adv = this;

    /**
     * Array containing list of communities.
     * @type {Array}
     */
    adv.searchItems = [];

    /**
     * Array containing list of collection within a community.
     * @type {Array}
     */
    adv.collections = [];

    adv.pageHeader = Messages.ADVANCED_SEARCH_PAGE_HEADER;

    adv.communityLabel = Messages.ADVANCED_SEARCH_COMMUNITY_LABEL;

    adv.collectionLabel = Messages.ADVANCED_SEARCH_COLLECTION_LABEL;

    adv.textLabel = Messages.ADVANCED_SEARCH_TEXT_LABEL;

    adv.submitLabel = Messages.ADVANCED_SEARCH_SUBMIT_LABEL;

    adv.items = [];

    adv.count = '';



    /**
     * Gets list of collections for a community.  Adds collection
     * list to the component scope.
     * @param id  the community id
     */
    function getCollectionsForCommunity(id) {

      if (id !== 0 && id !== '0' && id !== undefined) {
        var collections = GetCollectionsForCommunity.query({id: id});
        collections.$promise.then(function (data) {
          data.unshift({id: 0, name: 'All Collections'});
          adv.collections = data;

        });
      }

    }

    /**
     * Retrieves parent community information for collection
     * and updates component scope.
     * @param id  the community id
     */
    function getCommunityParentInfo(id) {
      if (id !== 0) {
        var info = GetCollectionInfo.query({item: id});
        info.$promise.then(function (data) {
          adv.communityId = data.parentCommunity.id;
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

        var items = GetCommunitiesForDiscover.query();
        items.$promise.then(function (data) {
          data.unshift({id: '0', name: 'All Departments'});
          AppContext.setDiscoverCommunities(data);
          adv.searchItems = data;

        });

      }
      else {
        adv.searchItems = AppContext.getDiscoverCommunities();
      }

    }


    /**
     * Handles selection of a collection.
     */
    adv.selectCollection = function (id) {

      /**
       * If the collection id is zero, the asset type
       * becomes COMMUNITY. Otherwise, the asset type
       * is COLLECTION.
       */
      if (id === 0) {


        QueryManager.setAssetType(AssetTypes.COMMUNITY);
        QueryManager.setAssetId(adv.communityId);

      } else {

        QueryManager.setAssetType(AssetTypes.COLLECTION);
        /**
         * Set the asset id to the id of the collection.
         */
        QueryManager.setAssetId(adv.collectionId);
      }

    };

    /**
     * Handles selection of community.
     */
    adv.selectCommunity = function () {

      QueryManager.setAssetId(adv.communityId);
      QueryManager.setAssetType(AssetTypes.COMMUNITY);
      /**
       * Get new collections list for this community.
       */
      getCollectionsForCommunity(adv.communityId);

    };



    /**
     * Handles search form submission.
     * @param terms  the query terms
     */
    adv.submit = function (terms) {

      console.log(terms);

      var type = 'all';

      adv.showHints = false;

      /**
       * Community search.
       */
      if (QueryManager.getAssetType() === AssetTypes.COLLECTION) {

        type = AssetTypes.COLLECTION;
        QueryManager.setAssetType(type);
        QueryManager.setAssetId(adv.collectionId);


      }
      /**
       * Collection search.
       */
      else {

        type = AssetTypes.COMMUNITY;
        QueryManager.setAssetType(type);
        QueryManager.setAssetId(adv.communityId);

      }

      /**
       * If search terms are provided, execute the search.
       */
      if (terms.length > 0) {
        QueryManager.setSearchTerms(terms);
        //$location.path('/advanced/' + type + '/' + id + '/' + terms);
        if (adv.hideComponents) {
          adv.hideComponents = false;
          doSearch();
        }  else {
          doSearch();
        }

      }

    };

    /**
     * Executes query to retrieve a fresh result set.
     */
    function doSearch() {
     

      /**
       * Hide the pager button.
       */
      AppContext.setPager(false);


      /**
       * Get promise.
       * @type {*|{method}|Session}
       */
      var items = SolrQuery.save({
        params: QueryManager.context.query

      });
      /**
       * Handle the response.
       */
      items.$promise.then(function (data) {

        QueryManager.setOffset(data.offset);



        adv.items = data.results;
        adv.count = data.count;
        

      });
    }

    function init() {

      adv.showHints = true;

      Utils.resetQuerySettings();

      /**
       * Input route parameters.
       */
      adv.type = $routeParams.type;
      var id = $routeParams.id;
      adv.terms = $routeParams.terms;

      /**
       * Remove any previous discovery filters.
       */
      QueryManager.clearDiscoveryFilters();

      /**
       * Normal initialization.
       */
      QueryManager.setAssetType(adv.type);

      QueryManager.setQueryType(QueryTypes.DISCOVER);

      QueryManager.setAction(QueryActions.SEARCH);

      QueryManager.setSort(QuerySort.ASCENDING);

      QueryManager.setSearchTerms(adv.terms);

      AppContext.setDiscoveryContext(DiscoveryContext.ADVANCED_SEARCH);

      QueryStack.clear();

      adv.hideComponents = true;

      /**
       * If the DSpace ID parameter is undefined then hide unnecessary
       * components and set this initial id to zero ('All Departments').
       */
      if (id === undefined) {
        adv.hideComponents = true;
        id = 0;
      }

      /**
       * Initialize the search component with collection
       * and community information.
       */
      if (adv.type === AssetTypes.COLLECTION) {
        /**
         * Set collection id on the component scope.
         */
        adv.collectionId = id;
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
        adv.collectionId = 0;
        /**
         * Set the community id on the component scope.
         */
        adv.communityId = id;
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
        if (adv.communityId !== 0) {
          getCollectionsForCommunity(adv.communityId);
        }
      }


    }

    init();

  }

  dspaceComponents.component('advancedSearchComponent', {

    templateUrl: '/advanced/templates/advanced.html',
    controller: AdvancedCtrl,
    controllerAs: 'adv'

  });

})();
