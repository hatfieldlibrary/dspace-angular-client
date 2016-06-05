/**
 * Component for advanced searches.  This component binds to the
 * DiscoveryFormExtensions service to get necessary functions that are
 * shared with the discovery search component.
 * Created by mspalti on 3/4/16.
 */

'use strict';

(function () {

  function AdvancedCtrl(SolrQuery,
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
                        DiscoveryFormExtensions) {

    var adv = this;

    /**
     * Set this to be the controller updated by the discovery util methods.
     */
    DiscoveryFormExtensions.setController(this);

    /**
     * Array containing list of communities.
     * @type {Array}
     */
    adv.communityItems = [];

    /**
     * Array containing list of collection within a community.
     * @type {Array}
     */
    adv.collections = [];

    /**
     * Label for page header text.
     * @type {string}
     */
    adv.pageHeader = Messages.DISCOVERY_PAGE_HEADER;

    /**
     * Label for the community select input.
     * @type {string}
     */
    adv.communityLabel = Messages.ADVANCED_SEARCH_COMMUNITY_LABEL;

    /**
     * Label for the collection select input.
     * @type {string}
     */
    adv.collectionLabel = Messages.ADVANCED_SEARCH_COLLECTION_LABEL;

    /**
     * Label for the text input field.
     * @type {string}
     */
    adv.textLabel = Messages.ADVANCED_SEARCH_TEXT_LABEL;

    /**
     * Label for the submit button.
     * @type {string}
     */
    adv.submitLabel = Messages.ADVANCED_SEARCH_SUBMIT_LABEL;

    /**
     * Items returned by advanced search query or paging request.
     * @type {Array}
     */
    adv.items = [];

    /**
     * Number of items return by advanced search query.
     * @type {string}
     */
    adv.count = 0;

    /**
     * Handles collection selection.
     * @param id
     */
    adv.selectCollection = function (id) {
      adv.collectionId = id;
      DiscoveryFormExtensions.selectCollection(id);
    };


    /**
     * Handles selection of community.
     */

    adv.selectCommunity = function () {
      DiscoveryFormExtensions.selectCommunity();
      DiscoveryFormExtensions.getCollectionsForCommunity(adv.communityId, adv.collectionId);

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
        params: QueryManager.getQuery()

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

    /**
     * Initializes the advanced search component to global search.
     */
    function init() {

      Utils.resetQuerySettings();

      /**
       * Remove any previous discovery filters.
       */
      QueryManager.clearDiscoveryFilters();

      /**
       * Normal initialization.
       */
      QueryManager.setAssetType(AssetTypes.COMMUNITY);

      QueryManager.setQueryType(QueryTypes.DISCOVER);

      QueryManager.setAction(QueryActions.SEARCH);

      QueryManager.setSort(QuerySort.ASCENDING);

      AppContext.setDiscoveryContext(DiscoveryContext.BASIC_SEARCH);

      QueryStack.clear();

      /**
       * Hide the result components on init.
       * @type {boolean}
       */
      adv.hideComponents = true;

      /**
       * Get the community list.
       */
      DiscoveryFormExtensions.getCommunities();

      /**
       * Set the collection id to zero.
       * @type {number}
       */
      adv.collectionId = 0;
      /**
       * Set the community id to zero (global search).
       */
      adv.communityId = 0;

    }

    init();

  }

  dspaceComponents.component('advancedSearchComponent', {

    templateUrl: '/ds/advanced/templates/advanced.html',
    controller: AdvancedCtrl,
    controllerAs: 'adv'

  });

})();
