/**
 * The pager component is primary loader responsible for requesting solr data.
 * Created by mspalti on 2/23/16.
 */

'use strict';

(function () {

  function PagerCtrl($location,
                     $scope,
                     $timeout,
                     SolrDataLoader,
                     Utils,
                     QueryManager,
                     DiscoveryContext,
                     AppContext,
                     QuerySort,
                     QueryActions,
                     FacetHandler) {


    var ctrl = this;

    var defaultField;
    var defaultOrder;
    var notPaging = true;

    /**
     * Number of items to return in pager.
     * @type {number}
     */
    var setSize = AppContext.getSetSize();
    /**
     * Count must be initialized to 0.
     * @type {number}
     */
    var count = 0;

    /**
     * Check to see if more search results are available.
     * @returns {boolean}
     */
    ctrl.more = function () {
      return AppContext.getCount() > QueryManager.getOffset() + setSize;
    };

    ctrl.showPager = true;

    /**
     * Current start position for view model.
     * @type {number}
     */
    ctrl.start = QueryManager.getOffset() + 1;
    /**
     * Current end position for view model.
     * @type {number}
     */
    ctrl.end = QueryManager.getOffset() + setSize;

    /**
     * This variable is used to hold the QueryField of
     * the current query.
     * @type {string}
     */
    var displayListType = '';

    function getNewList(field, sort, newRequest) {
      QueryManager.setQueryType(field);
      QueryManager.setSort(sort);
      updateList(QueryManager.getOffset(), newRequest);

    }

    /**
     * Listener for sort option location change.
     */
    $scope.$on('$locationChangeSuccess', function () {

      var qs = $location.search();

      /**
       * Empty query string.  Use default field and sort order.
       */
      if (Object.keys(qs).length === 0) {
        QueryManager.setOffset(0);
        getNewList(defaultField, defaultOrder, true);
      }

      else {

        var newRequest = notPaging && AppContext.isNewSet();

        QueryManager.setOffset(qs.offset);

        /**
         * Let facet handler check for LIST action.
         */
        FacetHandler.checkForListAction();
        /**
         * Author and subject lists use facets. If the facet
         * array is available, use it rather than making an
         * unneeded request for data.
         */
        if (AppContext.isAuthorListRequest()) {
          /**
           * Facet array exists.
           */
          if (AppContext.isNewSet()) {
            /**
             * Request a new facet array.
             */
            getNewList(qs.field, qs.sort, newRequest);

          } else {
            /**
             * Update parent using existing array.
             */
            updateParentNewSet(FacetHandler.reverseAuthorList(qs.sort));

          }
        }
        else if (AppContext.isSubjectListRequest()) {
          /**
           * Facet array exists.
           */
          if (AppContext.isNewSet()) {
            /**
             * Request a new facet array.
             */
            getNewList(qs.field, qs.sort, newRequest);

          }
          else {
            /**
             * Update parent using existing array.
             */
            updateParentNewSet(FacetHandler.reverseSubjectList(qs.sort));

          }

        } else {
          /**
           * If not subject or author, always request new
           * list using the field and sort order provided in
           * the query string.
           */
          getNewList(qs.field, qs.sort, newRequest);

        }
        /**
         * Set the new sort order in application context.
         */
        if (ctrl.context === 'collection') {
          AppContext.setListOrder(qs.sort);
        }
        delayPagerViewUpdate();

      }
    });

    /**
     * Update the parent component with new items.
     * @param data the next set if items.
     */
    function updateParent(data) {
      AppContext.setCount(data.count);

      ctrl.onUpdate({
        results: data.results,
        count: data.count,
        field: Utils.getFieldForQueryType()
      });

      notPaging = true;
      

    }

    /**
     * Update the parent component with new items.
     * @param data the next set if items.
     */
    function updateParentNewSet(data) {

      AppContext.setCount(data.count);

      ctrl.onNewSet({
        results: data.results,
        count: data.count,
        field: Utils.getFieldForQueryType()
      });

      notPaging = true;

    }

    /**
     * Set delay on showing the pager button.  The pager's view state
     * is managed via the application context.  This allows other components
     * to hide the button until pager has new results to display.
     */
    function delayPagerViewUpdate() {
      console.log('setting page to show')

      $timeout(function () {
        /**
         * Set pager in context.
         */
        AppContext.setPager(true);

      }, 300);

    }

    /**
     * Execute solr query.
     * @param start the start position for query result.
     */
    function updateList(newOffset, isNewSet) {

      if (AppContext.getDiscoveryContext() === DiscoveryContext.ADVANCED_SEARCH) { return; }

      QueryManager.setOffset(newOffset);

      displayListType = Utils.getFieldForQueryType();

      /**
       * For items, we need to make a new solr query for the next
       * result set.
       *
       * Here, we check to be sure the current query is not for authors
       * or subjects.
       */
      if (AppContext.isNotFacetQueryType()) {

        var items = SolrDataLoader.invokeQuery();

        if (items !== undefined) {
          items.$promise.then(function (data) {
            /** Handle result of the solr query. */
            if (isNewSet && notPaging) {
              updateParentNewSet(data);
            } else {
              updateParent(data);
            }

          });
        }

      }
      /**
       * List author and subject.
       */
      else {

        QueryManager.setAction(QueryActions.LIST);

        var qs = $location.search();
        /**
         * For authors or subjects, get next results from the facets
         * array rather than executing a new solr query.
         */
        if (AppContext.isAuthorListRequest()) {

          if (isNewSet && notPaging) {

            if (typeof qs.sort !== 'undefined') {
              QueryManager.setSort(qs.sort);
            }

            var result = SolrDataLoader.invokeQuery();

            result.$promise.then(function (data) {
              /**
               * Add the author array to shared context.
               * @type {string|Array|*}
               */
              AppContext.setAuthorsList(data.facets);
              /**
               * If the sort order is desc, reverse the new authors list.
               */
              if (qs.sort === QuerySort.DESCENDING) {
                AppContext.reverseAuthorList();
              }
              updateParentNewSet(FacetHandler.getAuthorList());


            });
          } else {
            updateParent(FacetHandler.getAuthorList());

          }

        } else if (AppContext.isSubjectListRequest()) {

          if (isNewSet && notPaging) {

            var result = SolrDataLoader.invokeQuery();

            result.$promise.then(function (data) {
              /**
               * Add the author array to shared context.
               * @type {string|Array|*}
               */
              AppContext.setSubjectList(data.facets);
              /**
               * If the sort order is desc, reverse the new subject list.
               */
              if (qs.sort === QuerySort.DESCENDING) {
                AppContext.reverseSubjectList();
              }
              updateParentNewSet(FacetHandler.getSubjectList());
            });
          } else {
            updateParent(FacetHandler.getSubjectList());
          }
        }
      }
      AppContext.setPager(true);

    }

    /**
     * This watch will show/hide the pager button
     * based on the app context.  This allows sort
     * options components to hide the pager button
     * so that it doesn't flash into view when changing
     * the option. Since both pager and sort options
     * are children of item list, this might be done
     * more efficiently via callbacks.
     */
    $scope.$watch(function () {
        return AppContext.getPager();
      },
      function (newValue, oldValue) {
        if (newValue !== oldValue) {
          ctrl.showPager = newValue;
        }
      });


    /**
     * Initialize data for the first set of items.
     *
     * The initial QueryManager state for the query context is
     * set outside of pager in the appropriate parent
     * component, e.g.: collection, discover...
     */
    function init() {

      var qs = $location.search();

      /**
       * If a query string is provided, update the query type and
       * sort order.
       */
      if (Object.keys(qs).length !== 0) {
        QueryManager.setQueryType(qs.field);
        QueryManager.setSort(qs.sort);
        QueryManager.setOffset(qs.offset);
      }
      /**
       *  When paging back through sort option changes we need to
       *  preserve the original query type and sort order for reloading
       *  the initial state.
       */
      defaultField = QueryManager.getQueryType();
      defaultOrder = QueryManager.getSort();

      AppContext.setPager(false);
      notPaging = true;

      getNewList(defaultField, defaultOrder, true);

    }

    init();


    /**
     * View model method for retrieving the previous result set.
     */
    ctrl.previous = function () {

      var start = QueryManager.getOffset();

      if (start >= setSize) {
        ctrl.start -= setSize;
        ctrl.end = ctrl.start + 9;
        start -= setSize;
        QueryManager.setOffset(start);
        notPaging = false;
        $location.search({'field': QueryManager.getQueryType(), 'sort': QueryManager.getSort(), 'terms': '', 'offset': start });
      }
    };

    /**
     * View model method for retrieveing the next result set.
     */
    ctrl.next = function () {

      var start = QueryManager.getOffset();

      start += setSize;
      ctrl.start = start + 1;
      if (ctrl.end + setSize <= count) {
        ctrl.end += setSize;
      } else {
        ctrl.end = count;
      }
      QueryManager.setOffset(start);
      notPaging = false;
      $location.search({'field': QueryManager.getQueryType(), 'sort': QueryManager.getSort(), 'terms': '', 'offset': start});

    };

  }


  dspaceComponents.component('pagerComponent', {

    template: '<div layout="row" layout-align="center center" ng-if="$ctrl.showPager"><md-button class="md-raised md-accent md-fab md-mini" ng-click="$ctrl.next()" ng-if="$ctrl.more()"><md-icon md-font-library="material-icons" class="md-light" aria-label="More Results">expand_more</md-icon></md-button></div>',
    bindings: {
      onUpdate: '&',
      onNewSet: '&',
      context: '@'
    },
    controller: PagerCtrl

  });

})();
