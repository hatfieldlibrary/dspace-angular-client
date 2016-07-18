/**
 * This component contains most of the logic for responding to
 * location changes, updating state and loading new data.
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
    var paging = false;
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

    function more() {
      return AppContext.getCount() > QueryManager.getOffset() + setSize;
    }

    /**
     * Check to see if more search results are available.
     * @returns {boolean}
     */
    pager.more = false;

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
     * Returns the previous sort order after updating
     * context with the new provided sort order.  Order
     * is independently tracked for subject, author
     * and item lists. This allows them to be toggled
     * (reversing the order) needed.
     * @param field  the current field
     * @param newSortOrder the new sort order
     * @returns {*}
     */
    function getSortOrder(field, newSortOrder) {
      /**
       * If the sort order is desc, reverse the new subject list
       * and update parent.
       */
      var order;
      if (field === QueryTypes.SUBJECT_FACETS) {
        order = AppContext.getSubjectsOrder();
        AppContext.setSubjectsOrder(newSortOrder);
      } else if (field === QueryTypes.AUTHOR_FACETS) {
        order = AppContext.getAuthorsOrder();
        AppContext.setAuthorsOrder(newSortOrder);
      } else {
        order = AppContext.getListOrder();
        AppContext.setListOrder(newSortOrder);
      }

      return order;
    }


    function isNewQuery(field, order, offset) {
      var check = (currentField !== field) || (currentOrder !== order) || (currentOffset !== offset);
      currentField = field;
      currentOrder = order;
      currentOffset = offset;

      return check;

    }

    /**
     * Update the parent component with additional items.
     * @param data the next set of items.
     */
    function updateParent(data, direction) {

      AppContext.setCount(data.count);
      pager.more = more();
      var off = QueryManager.getOffset();

      // Leave jump value undefined in pager updates.
      if (direction === 'prev') {

        pager.onPrevUpdate({
          results: data.results,
          count: data.count,
          field: Utils.getFieldForQueryType(),
          offset: off
        });

      } else {

        pager.onPagerUpdate({
          results: data.results,
          count: data.count,
          field: Utils.getFieldForQueryType(),
          offset: off,
        });

      }

      paging = false;
      AppContext.isNewSet(true);

    }

    /**
     * Replace the data in parent component.
     * @param data the next set if items.
     */
    function updateParentNewSet(data) {

      var off = QueryManager.getOffset();
      /**
       * For new sets, always update the start index.
       */
      AppContext.setStartIndex(QueryManager.getOffset());

      if (data) {
        AppContext.setCount(data.count);
        pager.more = more();
        pager.onNewSet({
          results: data.results,
          count: data.count,
          field: Utils.getFieldForQueryType(),
          offset: off,
          jump: false
        });
      }
    }

    /**
     * Recalculates the offset if the item position
     * provided in the query is less than the provided
     * offset value.
     * @param qs query string
     * @returns {number}
     */
    function verifyOffset(qs) {
      var offset = 0;

      if (qs.pos < qs.offset) {
        offset = Math.floor(qs.pos / setSize) * setSize;

      } else {
        offset = qs.offset;
      }

      return offset;
    }

    /**
     * Sets the offset value based on provided query
     * @param qs  the query string
     */
    function setOffset(qs) {

      if (typeof qs.offset !== 'undefined') {
        QueryManager.setOffset(verifyOffset(qs));
      }

      if (qs.d === 'prev') {
        // When backward paging, the new offset is
        // always tne new low index.
        AppContext.setStartIndex(qs.offset);
      }
      // unary operator
      else if (+qs.offset === 0) {
        AppContext.setStartIndex(0);
      }
    }



    /**
     * Sets the position of the currently open item on
     * page load. This is to be used with full items and inline
     * author and subject lists. The detail components watch
     * for changes in the context.
     * @param qs
     */
    function setOpenItemPosition(qs) {

      if (typeof qs.pos !== 'undefined') {

        /**
         * The position is lower than the current offset.
         */
        if (AppContext.getStartIndex() > 0) {
          if (qs.pos < QueryManager.getOffset()) {
            /**
             * New offset.
             * @type {number}
             */

            var newOffset = verifyOffset(qs);

            /**
             * Update the query with the new offset value.
             */
            QueryManager.setOffset(newOffset);
            /**
             * Use the new offset to determine the item position.
             */

            AppContext.setOpenItem(qs.pos - newOffset);
            AppContext.setSelectedPositionIndex(qs.pos - newOffset);
          }
          /**
           * The item position is within the set that will
           * be returned by the query using the provided offset.
           */
          else {
            /**
             * If the offset is provided in the query, use
             * this value to determine the item position
             * in the current set.
             */
            if (typeof qs.offset !== 'undefined') {
              AppContext.setOpenItem(qs.pos - qs.offset);
              AppContext.setSelectedPositionIndex(qs.pos - qs.offset);
            }
            /**
             * If the offset has not been provided in the query,
             * use the position provided. The default offset is
             * zero.
             */
            else {
              AppContext.setOpenItem(qs.pos);
              AppContext.setSelectedPositionIndex(qs.pos);
            }
          }
        } else {
          AppContext.setOpenItem(qs.pos);
          AppContext.setSelectedPositionIndex(qs.pos);

        }
      }
      /**
       * If not position param in the query, set to -1. This
       * prevents a match with item.
       */
      else {
        AppContext.setOpenItem(-1);
        AppContext.setSelectedPositionIndex(-1);
      }
    }


    function setOpenItem(qs) {

      if (typeof qs.offset !== 'undefined') {
        QueryManager.setOffset(qs.offset);
      } else {
        QueryManager.setOffset(0);
      }

      if (typeof qs.id !== 'undefined') {
        AppContext.setSelectedItemId(qs.id);
      } else {
        AppContext.setSelectedItemId(-1);
      }


      setOpenItemPosition(qs);

    }

    /**
     * Execute solr query.
     * @param start the start position for query result.
     */
    function updateList(isNewRequest, direction) {

      var qs = $location.search();

      /**
       * If advanced search, do nothing here.
       */
      if (AppContext.getDiscoveryContext() === DiscoveryContext.ADVANCED_SEARCH) {
        return;
      }

      /**
       * Check to be sure the current query is NOT for authors
       * or subjects.  These are handled differently.
       */
      if (AppContext.isNotFacetQueryType()) {

        var items = SolrDataLoader.invokeQuery();

        if (items !== undefined) {
          items.$promise.then(function (data) {

            setOpenItem(qs);

            if (isNewRequest) {
              /**
               * If not paging, swap in the new data.
               */
              updateParentNewSet(data);
            } else {
              /**
               * If paging, add the new data to the view.
               */
              updateParent(data, direction);
            }
          });
        }
      }
      else {

        QueryManager.setAction(QueryActions.LIST);

        var result;

        /** Author */

        if (AppContext.isAuthorListRequest()) {
          /**
           * If a new request, retrieve facets.
           */
          if (isNewRequest) {

            /** Retrieving new author facet list */
            result = SolrDataLoader.invokeQuery();
            result.$promise.then(function (data) {


              setOpenItem(qs);

              /**
               * Add the author array to shared context.
               * @type {string|Array|*}
               */
              AppContext.setAuthorsList(data.facets);
              /**
               * If the sort order is desc, reverse the author list and
               * update parent.
               */

              var order = getSortOrder(qs.field, qs.sort);

              if (qs.sort !== order) {
                updateParentNewSet(FacetHandler.reverseAuthorList());
              }
              /**
               * If order is asc, just add the author list to parent.
               */
              else {

                updateParentNewSet(FacetHandler.getAuthorList());
              }
            });
          } else {

            /**
             * If not a new request, use the existing author
             * facets.
             */
            if (currentField === QueryTypes.TITLES_LIST) {
              currentField = QueryTypes.AUTHOR_FACETS;
            }
            updateParent(FacetHandler.getAuthorList(), direction);

          }

        }

        /** Subject */

        else if (AppContext.isSubjectListRequest()) {

          if (isNewRequest) {

            /**
             * If a new request, retrieve facets.
             */
            result = SolrDataLoader.invokeQuery();

            result.$promise.then(function (data) {

              setOpenItem(qs);
              /**
               * Add the subject array to context.
               * @type {string|Array|*}
               */
              AppContext.setSubjectList(data.facets);

              var order = getSortOrder(qs.field, qs.sort);

              if (qs.sort !== order) {
                updateParentNewSet(FacetHandler.reverseSubjectList(order));
              }
              /**
               * If order is asc, just add the subject list to parent.
               */
              else {
                updateParentNewSet(FacetHandler.getSubjectList());
              }

            });

          } else {

            /** Updating parent with current facets */
            updateParent(FacetHandler.getSubjectList(), direction);
          }
        }
      }

      AppContext.setPager(true);
      pager.showPager = true;

    }

    /**
     * Initializes the request for new data.
     * @param field
     * @param sort
     * @param newRequest
     * @param direction
     */
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
          AppContext.setSelectedPositionIndex(-1);
          AppContext.setSelectedItemId(-1);
          AppContext.isNewSet();
          /**
           * Item dialog might be open.  Close it.
           */
          $mdDialog.cancel();

        }
        getNewList(defaultField, defaultOrder, true, '');
      }

      else {

        setOffset(qs);

        /**
         * If true, query results will replace current result set
         * in parent component.
         * @type {boolean|*}
         */
        var newRequest = AppContext.isNewSet() && !paging;


        if (AppContext.isNotFacetQueryType()) {
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
          } else {
            setOpenItem(qs);
          }

        }
        else {
          /**
           * Let facet handler set the action.
           */
          FacetHandler.checkForListAction();

          if (isNewQuery(qs.field, qs.sort, qs.offset)) {
            /**
             * Request a new facet array.
             */
            getNewList(qs.field, qs.sort, newRequest, qs.d);
          } else {
            setOpenItem(qs);
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
      paging = true;
      AppContext.isNewSet(false);
      var qs = $location.search();
      qs.field = QueryManager.getQueryType();
      qs.sort = QueryManager.getSort();
      qs.terms = '';
      qs.offset = start;
      delete qs.d;
      delete qs.id;
      delete qs.pos;
      $location.search(qs);

    };

    /**
     * Initialize the first set of items.
     *
     * The QueryManager state is set in the appropriate parent
     * component (e.g.: collection, discover). The state is also
     * updated here in response to changes in history state.
     */
    function _init() {

      var qs = $location.search();

      /**
       * If a query string is provided, update the query type,
       * sort order, and offset.
       */
      if (Object.keys(qs).length !== 0 && typeof qs.field !== 'undefined') {
        QueryManager.setQueryType(qs.field);
        QueryManager.setSort(qs.sort);
        QueryManager.setOffset(qs.offset);
        // unary operator
        AppContext.setStartIndex(qs.offset);
      }
      /**
       * If no query string is provided, set defaults.
       */
      else {
        if (QueryManager.getQueryType() !== QueryTypes.DISCOVER) {
          QueryManager.setQueryType(defaultField);
          QueryManager.setSort(defaultOrder);
          QueryManager.setOffset(0);
          AppContext.setStartIndex(0);
        }
      }

      setOpenItem(qs);

      AppContext.setPager(false);

      paging = false;
      currentField = QueryManager.getQueryType();
      currentOrder = QueryManager.getSort();


      if (isNewQuery(qs.field, qs.sort, qs.offset)) {
        getNewList(QueryManager.getQueryType(), QueryManager.getSort(), true);
      }

    }

    _init();

  }


  dspaceComponents.component('pagerComponent', {

    template: '<div layout="row" layout-align="center center" ng-if="pager.showPager"><md-button class="md-raised md-accent md-fab md-mini" href="#" ng-click="pager.next()" ng-if="pager.more"><md-icon md-font-library="material-icons" class="md-light" aria-label="More Results">expand_more</md-icon></md-button></div>',
    bindings: {
      onPagerUpdate: '&',
      onPrevUpdate: '&',
      onNewSet: '&',
      context: '@'
    },
    controller: PagerCtrl,
    controllerAs: 'pager'

  });

})();
