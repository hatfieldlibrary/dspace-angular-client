/**
 * This component contains most of the logic for responding to
 * location changes and loading data.
 * Created by mspalti on 2/23/16.
 */

'use strict';

(function () {
  /**
   * Pager controller.
   * @param $location
   * @param $scope
   * @param $timeout
   * @param SolrDataLoader
   * @param Utils
   * @param QueryManager
   * @param DiscoveryContext
   * @param AppContext
   * @param QuerySort
   * @param QueryActions
   * @param FacetHandler
   * @constructor
   */

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
                     QueryTypes,
                     FacetHandler,
                     $mdDialog) {


    var pager = this;

    var defaultField = QueryTypes.DATES_LIST;
    var defaultOrder = QuerySort.DESCENDING;
    var notPaging = true;
    var currentField = '';
    var currentOrder = '';
    var currentOffset = '';

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
    pager.more = function () {
      return AppContext.getCount() > QueryManager.getOffset() + setSize;
    };

    pager.showPager = false;

    /**
     * Current start position for view model.
     * @type {number}
     */
    pager.start = QueryManager.getOffset() + 1;
    /**
     * Current end position for view model.
     * @type {number}
     */
    pager.end = QueryManager.getOffset() + setSize;

    /**
     * This variable is used to hold the QueryField of
     * the current query.
     * @type {string}
     */
    // var displayListType = '';

    function isNewQuery(field, order, offset) {
      console.log('current off ' + currentOffset)
      console.log('offset provided ' + offset)

      var check = (currentField !== field) || (currentOrder !== order) || (currentOffset !== offset);
      currentField = field;
      currentOrder = order;
      currentOffset = offset;
      console.log('check is ' + check)
      return check;

    }

    /**
     * Update the parent component with new items.
     * @param data the next set if items.
     */
    function updateParent(data, direction) {

      AppContext.setCount(data.count);

      if (direction === 'prev') {

        pager.onPrevUpdate({
          results: data.results,
          count: data.count,
          field: Utils.getFieldForQueryType()
        });

      } else {

        pager.onUpdate({
          results: data.results,
          count: data.count,
          field: Utils.getFieldForQueryType()
        });

      }

      notPaging = true;

    }

    /**
     * Update the parent component with new items.
     * @param data the next set if items.
     */
    function updateParentNewSet(data) {

      if (data) {
        AppContext.setCount(data.count);

        pager.onNewSet({
          results: data.results,
          count: data.count,
          field: Utils.getFieldForQueryType()
        });
      }

      notPaging = true;

    }

    /**
     * Execute solr query.
     * @param start the start position for query result.
     */
    function updateList(isNewSet, direction) {

      if (AppContext.getDiscoveryContext() === DiscoveryContext.ADVANCED_SEARCH) {
        return;
      }

    //  QueryManager.setOffset(newOffset);

      //   displayListType = Utils.getFieldForQueryType();

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
            console.log(data)
            /** Handle result of the solr query. */
            if (isNewSet) {
              updateParentNewSet(data);
            } else {
              updateParent(data, direction);
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
        var result;
        /**
         * For authors or subjects, get next results from the facets
         * array rather than executing a new solr query.
         */
        if (AppContext.isAuthorListRequest()) {

          if (isNewSet && notPaging) {

            if (typeof qs.sort !== 'undefined') {
              QueryManager.setSort(qs.sort);
            }

            result = SolrDataLoader.invokeQuery();

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
            updateParent(FacetHandler.getAuthorList(), direction);

          }

        } else if (AppContext.isSubjectListRequest()) {

          if (isNewSet && notPaging) {

            result = SolrDataLoader.invokeQuery();

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
            updateParent(FacetHandler.getSubjectList(), direction);
          }
        }
      }

      AppContext.setPager(true);
      pager.showPager = true;

    }


    function getNewList(field, sort, newRequest, direction) {
      
      QueryManager.setQueryType(field);
      QueryManager.setSort(sort);
      updateList(newRequest, direction);

    }


    /**
     * Set delay on showing the pager button.  The pager's view state
     * is managed via the application context.  This allows other components
     * to hide the button until pager has new results to display.
     */
    function delayPagerViewUpdate() {

      $timeout(function () {
        /**
         * Set pager in context.
         */
        AppContext.setPager(true);

      }, 300);

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

        if (QueryManager.getAction() !== QueryActions.BROWSE) {
          QueryManager.setOffset(0);
          AppContext.setStartIndex(0);
          AppContext.setOpenItem(-1);
          AppContext.setCurrentIndex(-1);
          /**
           * Item dialog might be open.  Close it.
           */
          $mdDialog.cancel();

        }
        getNewList(defaultField, defaultOrder, true, '');
      }

      else {

        /**
         * If true, query results will replace current result set
         * in parent component.
         * @type {boolean|*}
         */
        var newRequest = notPaging && AppContext.isNewSet();

        QueryManager.setOffset(qs.offset);

        if (qs.d === 'prev') {
          // When back paging, the new offset is
          // always tne new low index.
          AppContext.setStartIndex(qs.offset);
        }
        else if (qs.offset === 0) {
          AppContext.setStartIndex(0);
        }

        /**
         * Check for item position in the query string.
         */
        if (typeof qs.pos !== 'undefined') {
          AppContext.setOpenItem(qs.pos);
          AppContext.setCurrentIndex(qs.pos);
          //QueryManager.setOffset(0);
        } else {
          AppContext.setOpenItem(-1);
          AppContext.setCurrentIndex(-1);
        }

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
           * Facet array does not exist. Requesting new data set.
           */
          if (AppContext.isNewSet()) {
            /**
             * Request a new facet array.
             */
            getNewList(qs.field, qs.sort, newRequest, qs.d);

          } else {
            /**
             * Update parent using existing array. Reverse the array
             * if the sort order has changed.
             */
            updateParentNewSet(FacetHandler.reverseAuthorList(qs.sort));

          }
        }
        else if (AppContext.isSubjectListRequest()) {
          /**
           * Facet array does not exist. Requesting new data set.
           */
          if (AppContext.isNewSet()) {
            /**
             * Request a new facet array.
             */
            getNewList(qs.field, qs.sort, newRequest, qs.d);

          }
          else {
            /**
             * Update parent using existing array.
             */
            updateParentNewSet(FacetHandler.reverseSubjectList(qs.sort));

          }

        } else {

          /**
           * Item dialog might be open.  Close it.
           */
          $mdDialog.cancel();
          /**
           * If not subject or author, always request new
           * list using the field and sort order provided in
           * the query string.
           */
          if (isNewQuery(qs.field, qs.sort, qs.offset)) {
            getNewList(qs.field, qs.sort, newRequest, qs.d);
          }

        }
        /**
         * Set the new sort order in application context.
         */
        if (pager.context === 'collection') {
          AppContext.setListOrder(qs.sort);
        }
        delayPagerViewUpdate();

      }
    });

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
          pager.showPager = newValue;
        }
      });


    /**
     * Initialize the first set of items.
     *
     * The QueryManager state is set in the appropriate parent
     * component (e.g.: collection, discover). The state is also
     * updated here in response to changes in history state.
     */
    function init() {

      var qs = $location.search();


      /**
       * If a query string is provided, update the query type and
       * sort order.
       */
      if (Object.keys(qs).length !== 0 && typeof qs.field !== 'undefined') {
        QueryManager.setQueryType(qs.field);
        QueryManager.setSort(qs.sort);
        QueryManager.setOffset(qs.offset);
        // unary operator
        AppContext.setStartIndex(+qs.offset);
      } else {
        if (QueryManager.getQueryType() !== QueryTypes.DISCOVER) {
          QueryManager.setQueryType(defaultField);
          QueryManager.setSort(defaultOrder);
          AppContext.setStartIndex(0);
        }
      }
      if (typeof qs.pos !== 'undefined') {
        AppContext.setOpenItem(qs.pos);
        AppContext.setCurrentIndex(qs.pos);
        QueryManager.setOffset(0);
      } else {
        AppContext.setOpenItem(-1);
        AppContext.setCurrentIndex(-1);
      }

      AppContext.setPager(false);

      notPaging = true;
      currentField = QueryManager.getQueryType();
      currentOrder = QueryManager.getSort();

      if (isNewQuery(qs.field, qs.sort, qs.offset)) {
        getNewList(QueryManager.getQueryType(), QueryManager.getSort(), true);
      }

    }

    init();


    /**
     * Method for retrieving the next result set.
     */
    pager.next = function () {

      var start = QueryManager.getOffset();

      start += setSize;
      pager.start = start + 1;
      if (pager.end + setSize <= count) {
        pager.end += setSize;
      } else {
        pager.end = count;
      }
    // QueryManager.setOffset(start);
      notPaging = false;
      $location.search({
        'field': QueryManager.getQueryType(),
        'sort': QueryManager.getSort(),
        'terms': '',
        'offset': start
      });

    };

  }


  dspaceComponents.component('pagerComponent', {

    template: '<div layout="row" layout-align="center center" ng-if="pager.showPager"><md-button class="md-raised md-accent md-fab md-mini" ng-click="pager.next()" ng-if="pager.more()"><md-icon md-font-library="material-icons" class="md-light" aria-label="More Results">expand_more</md-icon></md-button></div>',
    bindings: {
      onUpdate: '&',
      onPrevUpdate: '&',
      onNewSet: '&',
      context: '@'
    },
    controller: PagerCtrl,
    controllerAs: 'pager'

  });

})();
