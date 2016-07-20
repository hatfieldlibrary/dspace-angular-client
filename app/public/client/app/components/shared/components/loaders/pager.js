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

    /**
     * Default field
     */
    var defaultField = QueryTypes.DATES_LIST;
    /**
     * Default sort order
     */
    var defaultOrder = QuerySort.DESCENDING;

    var currentField = '';
    var currentOrder = '';
    var currentOffset = 0;
    var currentFilter ;


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

    pager.showPager = true;

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

    function _addResult(direction, data) {
      if (AppContext.isNewSet()) {
        /**
         * If not a new request, swap in the new data.
         */
        updateParentNewSet(data);
      } else {
        /**
         * If paging, add the new data to the view.
         */
        updateParent(data, direction);
      }
    }

    function _itemFilter() {

      AppContext.isFilter(true);

      var items = SolrDataLoader.filterQuery();
      items.$promise.then(function (data) {
        QueryManager.setOffset(data.offset);

        _addResult('next', data);
      });
    }

    /**
     * Fetches the authors array.
     * @param terms
     */
    function _fetchAuthors(terms, sort) {
      // Fetch authors.
      var result = SolrDataLoader.invokeQuery();
      result.$promise.then(function (data) {
        // Add the author array to context.
        AppContext.setAuthorsList(data.facets);
        // Initialize author sort order.
        AppContext.setAuthorsOrder(sort);
        // Call the filter method.
        _authorFilter(terms);
      });
    }

    /**
     * Authors filter.
     * @param terms
     */
    function _authorFilter(terms, sort, direction, initOffset) {

      AppContext.isFilter(true);

      // Author array exists, run filter.
      if (AppContext.getAuthors().length > 0) {
        // Get the authors sort order from context.
        var order = SolrDataLoader.getSortOrder(QueryManager.getQueryType, QueryManager.getSort());
        // Set the author facet list order.
        FacetHandler.setAuthorListOrder(order);
        // Get the offset for the matching index.
        var offset;
        if (AppContext.isNewSet()) {
          offset = FacetHandler.findIndexInArray(AppContext.getAuthors(), terms);
        } else {
          offset = QueryManager.getOffset() + setSize;
        }
        QueryManager.setOffset(offset);

        var set = setSize;
        if (typeof initOffset !== 'undefined') {
          set = Math.floor(initOffset / setSize) * setSize;
        }
        // Set the context start index to the matching offset.
        AppContext.setStartIndex(offset);
        if (AppContext.isNewSet()) {
          updateParentNewSet(FacetHandler.getAuthorListSlice());
        } else {
          updateParent(FacetHandler.getAuthorListSlice(), direction);
        }
      }
      else {
        // No author array is available on page initialization.
        // Fetch it.
        _fetchAuthors(terms, sort);
      }


    }

    /**
     * Fetches the subjects array.
     * @param terms
     */
    function _fetchSubjects(terms, sort, direction, initOffset) {
      // Fetch subjects.
      var result = SolrDataLoader.invokeQuery();
      result.$promise.then(function (data) {
        // Add the subject array to context.
        AppContext.setSubjectList(data.facets);
        // Initialize subject sort order.
        AppContext.setSubjectsOrder(sort);

        // Call the filter method.
        _subjectFilter(terms, sort, direction, initOffset);
      });
    }

    function _subjectFilter(terms, sort, direction, initOffset) {
      console.log(initOffset)

      AppContext.isFilter(true);

      if (AppContext.getSubjects().length > 0) {
        // Get the subjects sort order from context.
        var order = SolrDataLoader.getSortOrder(QueryManager.getQueryType(), QueryManager.getSort());
        // Set the subject facet list order.
        FacetHandler.setSubjectListOrder(order);
        // Get the offset for the matching index.
        var offset;
        console.log(initOffset)
       if (AppContext.isNewSet()) {

          offset = FacetHandler.findIndexInArray(AppContext.getSubjects(), terms);

        } else {
          offset = QueryManager.getOffset() + setSize;
        }
        console.log(offset)
        QueryManager.setOffset(offset);

        console.log(initOffset)
        var set = setSize;
        console.log(set)
        if (typeof initOffset !== 'undefined') {
          set = (Math.floor(initOffset / setSize) * setSize) + 20;
          if (AppContext.getSubjects().length > set) {
            set = AppContext.getSubjects().length;
          }

          console.log(set)
        }

        // Set the context start index to the matching offset.
        AppContext.setStartIndex(offset);


        if (AppContext.isNewSet()) {
          updateParentNewSet(FacetHandler.getSubjectListSlice(set));
        } else {
          updateParent(FacetHandler.getSubjectListSlice(set), direction);
        }

      }
      else {
        _fetchSubjects(terms, sort, direction, initOffset);
      }
    }

    /**
     * Tests to see if the current state requires a new solr query.
     * @param field field for the current state
     * @param order the sort order for the current state
     * @param offset the offset for the current state.
     * @returns {boolean}
     */
    function isNewQuery(field, order, offset, filter) {

      var check = (currentField !== field) || (currentOrder !== order) || (currentOffset !== offset || filter !== currentFilter);

      currentField = field;
      currentOrder = order;
      currentOffset = offset;
      currentFilter = filter;

      return check;

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

            var newOffset = SolrDataLoader.verifyOffset(qs);

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

    /**
     * Update the parent component with additional items.
     * @param data the next set of items.
     */
    function updateParent(data, direction) {

      AppContext.setCount(data.count);
      // pager.more = more();
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
          jump: false
        });

      }

      /** Return new set to true */
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
        pager.onNewSet({
          results: data.results,
          count: data.count,
          field: Utils.getFieldForQueryType(),
          offset: off,
          jump: true
        });
      }
    }


    /**
     * Sets offset, selected item and position for the
     * current state.
     * @param qs
     */
    function initializePositions(qs) {

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
     *
     * @param field
     * @param sort
     * @param isNewRequest
     * @param direction
     */
    function updateList(field, sort, direction) {

      var isNewRequest = AppContext.isNewSet();

      if (typeof field !== 'undefined') {
        QueryManager.setQueryType(field);
      }
      if (typeof sort != 'undefined') {
        QueryManager.setSort(sort);
      }

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

            if (isNewRequest) {
              /**
               * If not a new request, swap in the new data.
               */
              updateParentNewSet(data);
            } else {
              /**
               * If paging, add the new data to the view.
               */
              updateParent(data, direction);
            }

            initializePositions(qs);
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

              /**
               * Add the author array to shared context.
               * @type {string|Array|*}
               */
              AppContext.setAuthorsList(data.facets);
              /**
               * If the sort order is desc, reverse the author list and
               * update parent.
               */

              FacetHandler.setAuthorListOrder(SolrDataLoader.getSortOrder(qs.field, qs.sort));

              updateParentNewSet(FacetHandler.getAuthorListSlice(setSize));

              initializePositions(qs);

            });
          } else {

            /**
             * If not a new request, use the existing author
             * facets.
             */
            updateParent(FacetHandler.getAuthorListSlice(setSize), direction);

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
              /**
               * Add the subject array to context.
               * @type {string|Array|*}
               */
              AppContext.setSubjectList(data.facets);

              FacetHandler.setSubjectListOrder(SolrDataLoader.getSortOrder(qs.field, qs.sort));

              updateParentNewSet(FacetHandler.getSubjectListSlice(setSize));

              initializePositions(qs);


            });

          } else {

            /** Updating parent with current facets */
            updateParent(FacetHandler.getSubjectListSlice(setSize), direction);
          }
        }
      }

      AppContext.setPager(true);

    }

    /**
     * Listener for sort option location change.
     */
    $scope.$on('$locationChangeSuccess', function () {

      AppContext.isFilter(false);

      var qs = $location.search();

      /**
       * Empty query string.  Use default field and sort order.
       */
      if (Object.keys(qs).length === 0) {

        AppContext.isNewSet(true);

        if (QueryManager.getAction() !== QueryActions.BROWSE) {
          QueryManager.setOffset(0);
          QueryManager.setFilter('');
          AppContext.setStartIndex(0);
          AppContext.setOpenItem(-1);
          AppContext.setSelectedPositionIndex(-1);
          AppContext.setSelectedItemId(-1);
          /**
           * Item dialog might be open.  Close it.
           */
          $mdDialog.cancel();

        }


        updateList(defaultField, defaultOrder, 'next');
      }

      else {

        AppContext.isFilter(false);

        console.log('getting facets')

        if (typeof qs.filter === 'undefined') {
          qs.filter = 'none';
        }

        if (typeof qs.terms !== 'undefined') {
          QueryManager.setFilter(qs.terms);
        }

        SolrDataLoader.setOffset(qs);

        /**
         * If true, query results will replace current result set
         * in parent component.
         * @type {boolean|*}
         */


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
          if (qs.filter === 'item' && AppContext.isNewSet()) {

            _itemFilter();

          }
          else if (isNewQuery(qs.field, qs.sort, qs.offset, qs.filter)) {
            updateList(qs.field, qs.sort, qs.d);
          }
          else {
            initializePositions(qs);
          }

        }
        else {
          /**
           * Let facet handler set the action.
           */
          FacetHandler.checkForListAction();

          if (qs.filter === 'author') {
            _authorFilter(qs.terms, qs.d);

          }
          else if (qs.filter === 'subject') {
            _subjectFilter(qs.terms, qs.d);
          }
          else if (isNewQuery(qs.field, qs.sort, qs.offset, qs.filter)) {
            /**
             * Request a new facet array.
             */
            updateList(qs.field, qs.sort, qs.d);
          }
          else {
            initializePositions(qs);
          }
        }
        /**
         * Set the new sort order in application context.
         */
        if (pager.context === 'collection') {
          AppContext.setListOrder(qs.sort);
        }

        Utils.delayPagerViewUpdate();

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
          // pager.showPager = newValue;
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
      //  paging = true;
      AppContext.isNewSet(false);
      var qs = $location.search();
      qs.field = QueryManager.getQueryType();
      qs.sort = QueryManager.getSort();
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

      AppContext.isFilter(false);

      var qs = $location.search();

      AppContext.isNewSet(true);

      /**
       * If a query string is provided, update the query type,
       * sort order, and offset.
       */
      if (Object.keys(qs).length !== 0) {

        if (typeof qs.field !== 'undefined') {
          QueryManager.setQueryType(qs.field);
          QueryManager.setSort(qs.sort);
          QueryManager.setOffset(qs.offset);
          if (qs.d === 'prev') {
            AppContext.setStartIndex(qs.offset);
          }
        } else {
          QueryManager.setQueryType(defaultField);
          QueryManager.setSort(defaultOrder);
          QueryManager.setOffset(0);
          AppContext.setStartIndex(0);
        }

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

      if (typeof qs.filter === 'undefined') {
        qs.filter = 'none';
      }


      if (typeof qs.terms !== 'undefined') {
        QueryManager.setFilter(qs.terms);
      }

      /**
       * Sets the open position or item id for the current state.
       */
      initializePositions(qs);

      AppContext.setPager(false);


      currentField = QueryManager.getQueryType();
      currentOrder = QueryManager.getSort();

      if (qs.filter !== 'none') {
        /**
         * Set the filter query type.
         */
        SolrDataLoader.setJumpType();
        /**
         * Set offset.
         */
        SolrDataLoader.setOffset(qs);
        if (qs.filter === 'item' && AppContext.isNewSet()) {
          /**
           * Execute item filter.
           */
          _itemFilter();
        } else if (qs.filter === 'author') {
          /**
           * Execute author filter.
           */
          if (typeof qs.terms !== 'undefined' && qs.terms.length === 0)  {
            QueryManager.setOffset(0);
            AppContext.setStartIndex(0)
          }
          _authorFilter(qs.terms, qs.d, qs.offset);
        } else if (qs.filter === 'subject') {

          if (typeof qs.terms !== 'undefined' && qs.terms.length === 0)  {
            QueryManager.setOffset(0);
            AppContext.setStartIndex(0);
          }
          /**
           * Execute subject filter.
           */
          console.log(qs.offset)
          _subjectFilter(qs.terms, qs.sort, qs.d, qs.offset);
        }
      }
      else if (isNewQuery(qs.field, qs.sort, qs.offset, qs.filter)) {
        updateList(QueryManager.getQueryType(), QueryManager.getSort(), qs.d);
      }

    }

    _init();

  }


  dspaceComponents.component('pagerComponent', {

    template: '<div layout="row" layout-align="center center" ng-if="pager.showPager"><a href ng-click="pager.next()"><md-button class="md-raised md-accent md-fab md-mini" ng-if="pager.more()"><md-icon md-font-library="material-icons" class="md-light" aria-label="More Results">expand_more</md-icon></md-button></a></div>',
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
