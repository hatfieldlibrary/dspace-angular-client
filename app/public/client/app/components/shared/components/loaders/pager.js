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
    var currentFilter;


    /**
     * Number of items to return in pager.
     * @type {number}
     */
    var setSize = AppContext.getSetSize();

    var set = setSize;

    /**
     * Count must be initialized to 0.
     * @type {number}
     */
    var count = 0;

   // pager.more = false;

    /**
     * Check to see if more search results are available.
     * @returns {boolean}
     */
    pager.moreItems = function() {
      console.log('more ' + AppContext.getCount() > QueryManager.getOffset() + set);
      return AppContext.getCount() > QueryManager.getOffset() + set;
    } ;

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

    function _itemFilter(offset) {

      AppContext.isFilter(true);
      var items;
      // unary operator
      if (typeof offset !== 'undefined' && +offset !== 0) {
        QueryManager.setOffset(offset);
        items = SolrDataLoader.invokeQuery();
        items.$promise.then(function (data) {
          AppContext.setNextPagerOffset(data.offset);
          AppContext.setStartIndex(data.offset);
          _addResult('next', data);
        });
      }

      else {
        items = SolrDataLoader.filterQuery();
        items.$promise.then(function (data) {

          QueryManager.setOffset(data.offset);
          AppContext.setNextPagerOffset(data.offset);
          AppContext.setStartIndex(data.offset);

          _addResult('next', data);

        });
      }
    }

    /**
     * Fetches the authors array.
     * @param terms
     */
    function _fetchAuthors(terms, sort, direction, initOffset) {
      // Fetch authors.
      var result = SolrDataLoader.invokeQuery();
      result.$promise.then(function (data) {
        // Add the author array to context.
        AppContext.setAuthorsList(data.facets);
        // Initialize author sort order.
        // AppContext.setAuthorsOrder(sort);
        AppContext.setNextPagerOffset(data.offset);

        // Call the filter method.

        _authorFilter(terms, sort, direction, initOffset);
      });
    }

    function _findOffset(initOffset, terms, direction, type) {

      var offset;
      offset = FacetHandler.getFilterOffset(initOffset, terms, type);
      AppContext.setNextPagerOffset(offset);
      AppContext.setPreviousPagerOffset(offset);

      return offset;

    }

    /**
     * Authors filter.
     * @param terms
     */

    function _authorFilter(terms, sort, direction, initOffset) {

      AppContext.isFilter(true);
      // Author array exists. We can run filter.
      if (AppContext.getAuthors().length > 0) {

        // Get the offset.

        var offset = _findOffset(initOffset, terms, direction, 'author');


        QueryManager.setOffset(offset);
       // AppContext.setNextPagerOffset(offset);


        if (AppContext.isNewSet()) {
          // Set the context start index to the matching offset.
          AppContext.setStartIndex(offset);

          updateParentNewSet(FacetHandler.getAuthorListSlice(set));

        } else {
          updateParent(FacetHandler.getAuthorListSlice(set), direction);
        }

      }
      else {
        // No author array is available.
        // Fetch it.
        _fetchAuthors(terms, sort, direction, initOffset);
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
        AppContext.setNextPagerOffset(data.offset);
        // Call the filter method.
        _subjectFilter(terms, sort, direction, initOffset);
      });
    }

    function _subjectFilter(terms, sort, direction, initOffset) {

      AppContext.isFilter(true);

      if (AppContext.getSubjects().length > 0) {
        // Set the subject facet list order.
        // FacetHandler.setSubjectListOrder(sort);
        // Get the offset.
        var offset = _findOffset(initOffset, terms, direction, 'subject');

        QueryManager.setOffset(offset);
        AppContext.setNextPagerOffset(offset);

        if (AppContext.isNewSet()) {
          // Set the context start index to the matching offset.
          AppContext.setStartIndex(offset);
          updateParentNewSet(FacetHandler.getSubjectListSlice(setSize));

        } else {

          updateParent(FacetHandler.getSubjectListSlice(setSize), direction);
        }

        AppContext.setSubjectsOrder(sort);

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
              if (qs.filter === 'none') {
                AppContext.setOpenItem(qs.pos - qs.offset);
                AppContext.setSelectedPositionIndex(qs.pos - qs.offset);
              }
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
          if (typeof qs.offset !== 'undefined') {
            if (qs.filter === 'none') {
              AppContext.setOpenItem(qs.pos);
              AppContext.setSelectedPositionIndex(qs.pos);
            }
            else {
              if (qs.pos > setSize) {
                AppContext.setOpenItem(qs.pos - setSize);
                AppContext.setSelectedPositionIndex(qs.pos - setSize);
              } else {
                AppContext.setOpenItem(qs.pos);
                AppContext.setSelectedPositionIndex(qs.pos);
              }
            }
          }
          // AppContext.setOpenItem(qs.pos);
          // AppContext.setSelectedPositionIndex(qs.pos);

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


      // Leave jump value undefined in pager updates.
      if (direction === 'prev') {

        pager.onPrevUpdate({
          results: data.results,
          count: data.count,
          field: Utils.getFieldForQueryType()
        });

      } else {

        pager.onPagerUpdate({
          results: data.results,
          count: data.count,
          field: Utils.getFieldForQueryType()
        });

      }

      /** Return new set to true */
      AppContext.isNewSet(true);

   //   pager.more = _moreItems();


    }

    /**
     * Replace the data in parent component.
     * @param data the next set if items.
     */
    function updateParentNewSet(data) {


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
          offset: QueryManager.getOffset(),
          jump: true
        });
      }


     // pager.more = _moreItems();
    }


    /**
     * Sets the query offset, the selected item id, and item index position
     * as provided in the query string..
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
     * Updates the component with new data.
     * @param field
     * @param sort
     * @param isNewRequest
     * @param direction
     */
    function updateList(field, sort, direction) {

      var isNewRequest = AppContext.isNewSet();

      if (!isNewRequest) {
        if (direction === 'prev') {
          QueryManager.setOffset(AppContext.getPrevousPagerOffset());
        } else {
          QueryManager.setOffset(AppContext.getNextPagerOffset());
        }
      }

      if (typeof field !== 'undefined') {
        QueryManager.setQueryType(field);
      }
      if (typeof sort !== 'undefined') {
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

              FacetHandler.setAuthorListOrder(qs.sort);

              updateParentNewSet(FacetHandler.getAuthorListSlice(set));

              initializePositions(qs);

            });
          } else {

            /**
             * If not a new request, use the existing author
             * facets.
             */
            updateParent(FacetHandler.getAuthorListSlice(set), direction);

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

              FacetHandler.setSubjectListOrder(qs.sort);

              updateParentNewSet(FacetHandler.getSubjectListSlice(set));

              initializePositions(qs);


            });

          } else {

            /** Updating parent with current facets */
            updateParent(FacetHandler.getSubjectListSlice(set), direction);
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


        if (typeof qs.filter === 'undefined') {
          qs.filter = 'none';
        }

        if (typeof qs.terms !== 'undefined') {
          QueryManager.setFilter(qs.terms);
        }

        if (typeof qs.new !== 'undefined') {
          if (qs.new === 'false') {
            AppContext.isNewSet(false);
          } else {
            AppContext.isNewSet(true);
          }
        }


        SolrDataLoader.setOffset(qs);

        if (AppContext.isNotFacetQueryType()) {

          if (qs.d !== 'prev') {
            if (typeof qs.offset !== 'undefined') {
              AppContext.setNextPagerOffset(qs.offset);
            }
          }

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

            currentFilter = qs.filter;
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

            currentFilter = qs.filter;
            if (AppContext.isNewSet()) {
              _authorFilter(qs.terms, qs.sort, qs.d);
            }
            else {
              _authorFilter(qs.terms, qs.sort, qs.d, qs.offset);
            }

          }
          else if (qs.filter === 'subject') {

            currentFilter = qs.filter;
            if (AppContext.isNewSet()) {
              _subjectFilter(qs.terms, qs.sort, qs.d);
            }
            else {
              _subjectFilter(qs.terms, qs.sort, qs.d, qs.offset);
            }


          }
          else if (isNewQuery(qs.field, qs.sort, qs.offset, qs.filter)) {
            if (qs.d !== 'prev') {
              if (typeof qs.offset !== 'undefined') {
                AppContext.setNextPagerOffset(qs.offset);
              }
            }
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

    // /**
    //  * This watch will show/hide the pager button
    //  * based on the app context.  This allows sort
    //  * options components to hide the pager button
    //  * so that it doesn't flash into view when changing
    //  * the option. Since both pager and sort options
    //  * are children of item list, this might be done
    //  * more efficiently via callbacks.
    //  */
    // $scope.$watch(function () {
    //     return AppContext.getPager();
    //   },
    //   function (newValue, oldValue) {
    //     if (newValue !== oldValue) {
    //       // pager.showPager = newValue;
    //     }
    //   });

    /**
     * Method for retrieving the next result set.
     */
    // pager.next = function () {
    //
    //   var offset = parseInt(AppContext.getNextPagerOffset(), 10);
    //
    //   console.log(offset)
    //
    //   offset += setSize;
    //
    //   AppContext.setNextPagerOffset(offset);
    //   pager.start = offset + 1;
    //   if (pager.end + setSize <= count) {
    //     pager.end += setSize;
    //   } else {
    //     pager.end = count;
    //   }
    //   AppContext.isNewSet(false);
    //   var qs = $location.search();
    //   qs.field = QueryManager.getQueryType();
    //   qs.sort = QueryManager.getSort();
    //   qs.offset = offset;
    //   delete qs.d;
    //   delete qs.id;
    //   delete qs.pos;
    //   //  alert('next')
    //   // $location.search(qs);
    //   ctrl.url = $location.path() + 'field=' + qs.field + '&sort=' + qs.sort + '&offset=' + qs.offset;
    //
    // };

    pager.nextUrl = function () {

      var offset = parseInt(AppContext.getNextPagerOffset(), 10);
      offset += setSize;
      pager.start = offset + 1;
      if (pager.end + setSize <= count) {
        pager.end += setSize;
      } else {
        pager.end = count;
      }
      var qs = $location.search();
      var url = $location.path() + '?';
      var arr = Object.keys(qs);
      for (var i = 0; i < arr.length; i++) {
        if (arr[i] !== 'offset' && arr[i] !== 'new' && arr[i] !== 'd') {
          url += '&' + arr[i] + '=' + qs[arr[i]];
        }
      }
      url += '&offset=' + offset;
      url += '&new=false';

      return url;

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
          _itemFilter(qs.offset);

        } else if (qs.filter === 'author') {

          AppContext.setAuthorsOrder(qs.sort);

          /**
           * Execute author filter.
           */
          if (typeof qs.terms !== 'undefined' && qs.terms.length === 0) {
            QueryManager.setOffset(0);
            AppContext.setStartIndex(0);
          }
          _authorFilter(qs.terms, qs.sort, qs.d, qs.offset);

        } else if (qs.filter === 'subject') {

          AppContext.setSubjectsOrder(qs.sort);

      //    AppContext.isNewSet(true);

          if (typeof qs.terms !== 'undefined' && qs.terms.length === 0) {
            QueryManager.setOffset(0);
            AppContext.setStartIndex(0);
          }
          /**
           * Execute subject filter.
           */
          _subjectFilter(qs.terms, qs.sort, qs.d, qs.offset);


        }
      }
      else if (isNewQuery(qs.field, qs.sort, qs.offset, qs.filter)) {

        setIndex(qs);


        // if (typeof qs.offset !== 'undefined') {
        //   QueryManager.setOffset(qs.offset);
        // }
        updateList(QueryManager.getQueryType(), QueryManager.getSort(), qs.d);
      }

    }

    function setIndex(qs) {
      if (typeof qs.offset !== 'undefined') {
        if (qs.d !== 'prev') {
          AppContext.setNextPagerOffset(+qs.offset + setSize);
        }
        else {
          AppContext.setStartIndex(qs.offset);
        }

      }
    }

    _init();

  }


  dspaceComponents.component('pagerComponent', {

    templateUrl: '/ds/shared/templates/loaders/pager.html',
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
