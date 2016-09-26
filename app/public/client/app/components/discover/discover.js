/**
 * Component for discovery searches.  This component binds to the
 * DiscoveryFormExtensions service to get necessary functions that are
 * shared with the advanced search component.
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
                        QuerySort,
                        DiscoveryContext,
                        AppContext,
                        Utils,
                        Messages,
                        PageTitle,
                        DiscoveryFormExtensions) {

    var disc = this;

    /**
     * Input route parameters.
     */
    disc.type = $routeParams.type;
    var id = $routeParams.id;
    disc.terms = $routeParams.terms;
    disc.context = QueryActions.SEARCH;

    /**
     * Pass the controller to discovery extensions.
     */
    DiscoveryFormExtensions.setController(this);

    /**
     * Array containing list of communities.
     * @type {Array}
     */
    disc.communityItems = [];

    /**
     * Array containing list of collections within a community. This is updated
     * by the DiscoveryFormExtensions service.
     * @type {Array}
     */
    disc.collections = [];

    /**
     * Label for page header text.
     * @type {string}
     */
    disc.pageHeader = Messages.DISCOVERY_PAGE_HEADER;

    PageTitle.setTitle(Messages.DISCOVERY_PAGE_HEADER);

    /**
     * Label for the community select input.
     * @type {string}
     */
    disc.communityLabel = Messages.ADVANCED_SEARCH_COMMUNITY_LABEL;

    /**
     * Label for the collection select input.
     * @type {string}
     */
    disc.collectionLabel = Messages.ADVANCED_SEARCH_COLLECTION_LABEL;

    /**
     * Label for the text input field.
     * @type {string}
     */
    disc.textLabel = Messages.ADVANCED_SEARCH_TEXT_LABEL;

    /**
     * Label for the submit button.
     * @type {string}
     */
    disc.submitLabel = Messages.ADVANCED_SEARCH_SUBMIT_LABEL;
    /**
     * Boolean used to hide result list component when not in use.
     * @type {boolean}
     */
    disc.hideComponents = false;

    /**
     * Handles collection selection.
     * @param id
     */
    disc.selectCollection = function (id) {
      disc.collectionId = id;
      DiscoveryFormExtensions.selectCollection(id);
    };

    /**
     * Handles community selection.
     */
    disc.selectCommunity = function () {
      DiscoveryFormExtensions.selectCommunity();
      DiscoveryFormExtensions.getCollectionsForCommunity(disc.communityId);
      disc.collectionId = 0;

    };

    /**
     * Handles search form submission.
     * @param terms  the query terms
     */
    disc.submit = function () {

      QueryManager.setOffset(0);

      $location.search({});
      /**
       * If search terms are provided, execute the search. Discovery searches
       * use path routing to reload the page.
       */
      if (disc.terms.length > 0) {
        $location.path('/ds/discover/' + QueryManager.getAssetType() + '/' + QueryManager.getAssetId() + '/' + disc.terms);
      }

    };

    /**
     * Initialization.
     */
    function init() {

      Utils.resetQuerySettings();

      /**
       * Remove any previous discovery filters.
       */
      QueryManager.clearDiscoveryFilters();

      /**
       * Routine initialization.
       */
      QueryManager.setAssetType(disc.type);

      QueryManager.setQueryType(QueryTypes.DISCOVER);

      QueryManager.setAction(QueryActions.SEARCH);

      QueryManager.setSort(QuerySort.ASCENDING);

      QueryManager.setSearchTerms(disc.terms);

      QueryManager.setOffset(0);

      AppContext.setDiscoveryContext(DiscoveryContext.BASIC_SEARCH);


      /**
       * If the DSpace ID parameter is undefined then hide unnecessary
       * components and set this initial id to zero ('All Departments').
       */
      if (id === undefined) {
        disc.hideComponents = true;
        id = 0;
      }

      /**
       * Get the community list.
       */
      DiscoveryFormExtensions.getCommunities();

      /**
       * The asset id is the id of the collection.
       */
      QueryManager.setAssetId(id);

      /**
       * If this is a collection query, set the collection id
       * and fetch the parent community.
       */
      if (disc.type === AssetTypes.COLLECTION) {

        disc.collectionId = id;
        /**
         * Get parent community info, including collections belonging the community.
         * Provide callback that locates the currently selected collection object.
         */
        DiscoveryFormExtensions.getParentCommunityInfo(id);

      }
      else {

        /**
         * If this is a community query, then set the collection id to zero.
         * @type {number}
         */
        disc.collectionId = 0;
        /**
         * Set the provided community.
         */
        disc.communityId = id;
        /**
         * Get list of collections for this community.
         */
        DiscoveryFormExtensions.getCollectionsForCommunity(disc.communityId);

      }
    }

    init();

  }

  dspaceComponents.component('discoverComponent', {

    templateUrl: '/ds/discover/discover.html',
    controller: DiscoverCtrl,
    controllerAs: 'disc'

  });

})();
