/**
 * Created by mspalti on 3/4/16.
 */

'use strict';

(function () {

  function AdvancedCtrl($routeParams,
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
                        DiscoveryFormUtils) {

    var adv = this;

    /**
     * Set this to be the controller updated by the discovery util methods.
     */
    DiscoveryFormUtils.setController(this);

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
     * Handles collection selection.
     * @param id
       */
    adv.selectCollection = function(id) {
      DiscoveryFormUtils.selectCollection(id);
    };


    /**
     * Handles selection of community.
     */

    adv.selectCommunity = function() {
      DiscoveryFormUtils.selectCommunity();
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

    /**
     * Handles search form submission.
     * @param terms  the query terms
     */
    adv.submit = function (terms) {

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

        /**
         * Show list components.
         */
        if (adv.hideComponents) {
          adv.hideComponents = false;

        }

        doSearch();

      }

    };

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
        DiscoveryFormUtils.getCommunities();
        /**
         * Get list of collections for this community.
         */
        if (adv.communityId !== 0) {
          DiscoveryFormUtils.getCollectionsForCommunity(adv.communityId);
        }
      }


    }

    init();

  }

  dspaceComponents.component('advancedSearchComponent', {

    templateUrl: '/ds/advanced/templates/advanced.html',
    controller: AdvancedCtrl,
    controllerAs: 'adv'

  });

})();
