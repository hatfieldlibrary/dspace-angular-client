/**
 * Created by mspalti on 2/23/16.
 */

'use strict';

(function () {

  function PagerCtrl($location,
                     $scope,
                     $timeout,
                     SolrQuery,
                     SolrBrowseQuery,
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
     * Get the offset for the next result set.
     * @returns {boolean}
     */
    ctrl.more = function () {
      return AppContext.getCount() > QueryManager.getOffset() + setSize;
    };
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

    function getNewList(field, sort) {
      QueryManager.setQueryType(field);
      QueryManager.setSort(sort);
      updateList(QueryManager.getOffset(), true);
    }

    /**
     * Listener for sort option location change.
     */
    $scope.$on('$locationChangeSuccess', function () {

      var qs = $location.search();

      // QueryManager.setOffset(0);

      /**
       * Empty query string.  Use default field and sort order.
       */
      if (Object.keys(qs).length === 0) {
        getNewList(defaultField, defaultOrder);
      }

      else {
        /**
         * Let facet handler check for LIST action.
         */
        FacetHandler.checkForListAction();
        /**
         * Author and subject lists use facets. If the facet
         * array is available, use it rather than making an
         * unneeded request for data.
         */
        if (QueryManager.isAuthorListRequest()) {
          /**
           * Facet array exists.
           */
          if (AppContext.getAuthors().length > 0) {
            /**
             * Update parent using existing array.
             */
            updateParentNewSet(FacetHandler.reverseAuthorList(qs.sort));

          } else {
            /**
             * Reqeust a new facet array.
             */
            getNewList(qs.field, qs.sort);

          }
        }
        else if (QueryManager.isSubjectListRequest()) {
          /**
           * Facet array exists.
           */
          if (AppContext.getSubjects().length > 0) {
            /**
             * Update parent using existing array.
             */
            updateParentNewSet(FacetHandler.reverseSubjectList(qs.sort));

          }
          else {
            /**
             * Reqeust a new facet array.
             */
            getNewList(qs.field, qs.sort);

          }

        } else {
          /**
           * If not subject or author, always request new
           * list using the field and sort order provided in
           * the query string.
           */
          getNewList(qs.field, qs.sort);

        }
        /**
         * Set the new sort order in application context.
         */
        if (ctrl.context === 'collection') {
          AppContext.setListOrder(qs.sort);
        }

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
        field: displayListType
      });

      delayUpdate();

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
        field: displayListType
      });

      delayUpdate();

    }

    function delayUpdate() {
      $timeout(function () {
        /**
         * Show the pager.
         * @type {boolean}
         */
        ctrl.showPager = true;
        /**
         * Set pager in context.
         */
        AppContext.setPager(true);
      }, 300);

    }

    /**
     * Invokes query for LIST, SEARCH, and BROWSE actions and
     * returns promise object.
     * @param newOffset the offset to use in the
     * @returns {*} promise
     */
    function invokeQuery() {

      var action = QueryManager.getAction();
      var context = QueryManager.getQuery();

      var items;
      /**
       * List query: POST.
       */
      if (action === QueryActions.LIST) {

        items = SolrQuery.save({
          params: context
        });

      }

      /**
       * Discovery or advanced search query: POST.
       */
      else if ((action === QueryActions.SEARCH ) && QueryManager.getSearchTerms() !== undefined) {

        items = SolrQuery.save({
          params: context

        });

      }

      /**
       * Browse query: GET.
       */
      else if (action === QueryActions.BROWSE) {

        items = SolrBrowseQuery.query({
          type: QueryManager.getAssetType(),
          id: QueryManager.getAssetId(),
          qType: QueryManager.getQueryType(),
          field: context.query.field,
          sort: QueryManager.getSort(),
          terms: context.query.terms,
          filter: QueryManager.getFilter(),
          offset: QueryManager.getOffset(),
          rows: QueryManager.getRows()

        });

      }

      return items;

    }

    /**
     * Execute solr query.
     * @param start the start position for query result.
     */
    function updateList(newOffset, isNewSet) {

      QueryManager.setOffset(newOffset);

      displayListType = Utils.getFieldForQueryType();

      /**
       * For items, we need to make a new solr query for the next
       * result set.
       *
       * Here, we check to be sure the current query is not for authors
       * or subjects.
       */
      if (!QueryManager.isAuthorListRequest() && !QueryManager.isSubjectListRequest()) {

        var items = invokeQuery();

        if (items !== undefined) {
          items.$promise.then(function (data) {
            /** Handle result of the solr query. */
            if (isNewSet) {
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
         * array rather than executing a new solr query.  This is always
         * safe since the author and subject facets are retrieved by
         * the sortOptions loader.
         */
        if (QueryManager.isAuthorListRequest()) {

          if (isNewSet) {

            if (typeof qs.sort !== 'undefined') {
              QueryManager.setSort(qs.sort);
            }

            var result = invokeQuery();

            result.$promise.then(function (data) {

              if (qs.sort === QuerySort.DESCENDING) {
                Utils.reverseArray(data.facets);
              }

              /**
               * Add the author array to shared context.
               * @type {string|Array|*}
               */
              AppContext.setAuthorsList(data.facets);
              updateParentNewSet(FacetHandler.getAuthorList());

            });
          } else {
            updateParent(FacetHandler.getAuthorList());

          }

        } else if (QueryManager.isSubjectListRequest()) {
          if (isNewSet) {

            var result = invokeQuery();

            result.$promise.then(function (data) {
              if (qs.sort === QuerySort.DESCENDING) {
                Utils.reverseArray(data.facets);
              }
              /**
               * Add the author array to shared context.
               * @type {string|Array|*}
               */
              AppContext.setSubjectList(data.facets);
              updateParentNewSet(FacetHandler.getSubjectList());
            });
          } else {
            updateParent(FacetHandler.getSubjectList());
          }
        }
      }

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

      if (Object.keys(qs).length !== 0) {
        QueryManager.setQueryType(qs.field);
        QueryManager.setSort(qs.sort);
      }

      defaultField = QueryManager.getQueryType();
      defaultOrder = QueryManager.getSort();

      if (AppContext.getDiscoveryContext() !== DiscoveryContext.ADVANCED_SEARCH) {
        updateList(QueryManager.getOffset(), true);
      }

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
        updateList(start, false);
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
      updateList(start, false);

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
