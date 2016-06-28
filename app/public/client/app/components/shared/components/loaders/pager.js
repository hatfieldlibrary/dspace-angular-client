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
                     QueryActions) {


    var ctrl = this;

    var defaultField;
    var defaultOrder;
    var toggleOrder = false;

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


    $scope.$on('$locationChangeSuccess', function () {

      console.log('location change')
      var qs = $location.search();

      if (Object.keys(qs).length === 0) {
        QueryManager.setSort(defaultOrder);
        QueryManager.setQueryType(defaultField);
        updateList(QueryManager.getOffset(), true);
      }
      else if (QueryManager.isAuthorListRequest() || QueryManager.isSubjectListRequest()) {

        QueryManager.setAction(QueryActions.LIST);

        if (qs.sort !== QueryManager.getSort()) {
          QueryManager.setOffset(0);
          if (QueryManager.isAuthorListRequest()) {
            AppContext.reverseAuthorList();
            var data = {};
            data.count = AppContext.getAuthorsCount();
            var end = Utils.getPageListCount(data.count, setSize);
            data.results = Utils.authorArraySlice(QueryManager.getOffset(), QueryManager.getOffset() + end);
            updateParentNewSet(data);
          }
          if (QueryManager.isSubjectListRequest()) {
            AppContext.reverseSubjectList();
            var data = {};
            data.count = AppContext.getSubjectsCount();
            var end = Utils.getPageListCount(data.count, setSize);
            data.results = Utils.subjectArraySlice(QueryManager.getOffset(), QueryManager.getOffset() + end);
            updateParentNewSet(data);
          }

        } else {

          QueryManager.setQueryType(qs.field);
          QueryManager.setSort(qs.sort);
          // should this be called when the query is facets?
          // sortOptions is execing the facet searches...
          updateList(QueryManager.getOffset(), true);

        }
      } else {
        QueryManager.setQueryType(qs.field);
        QueryManager.setSort(qs.sort);
        // should this be called when the query is facets?
        // sortOptions is execing the facet searches...
        updateList(QueryManager.getOffset(), true);
      }
    });

    function doSearch() {
      var items = SolrQuery.save({
        params: QueryManager.getQuery()

      });
      return items;
    }

    /**
     * Update the parent component with new items.
     * @param data the next set if items.
     */
    function updateParent(data) {


      AppContext.setCount(data.count);

      console.log('calling parent update method')


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

    function invokeQuery(newOffset) {

      var action = QueryManager.getAction();
      var context = QueryManager.getQuery();
      console.log(context)

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
          offset: newOffset,
          rows: QueryManager.getRows()

        });

      }

      return items;
    }

    /**
     * Execute node REST API call for solr query results.
     * @param start the start position for query result.
     */
    function updateList(newOffset, isNewSet) {

      console.log('running update')

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

        var items = invokeQuery(newOffset);

        if (items !== undefined) {
          items.$promise.then(function (data) {
            console.log('got query response');
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

        var data = [];

        var end;

        QueryManager.setAction(QueryActions.LIST);

        /**
         * For authors or subjects, get next results from the facets
         * array rather than executing a new solr query.  This is always
         * safe since the author and subject facets are retrieved by
         * the sortOptions loader.
         */
        if (QueryManager.isAuthorListRequest()) {



          if (isNewSet) {

            var result = doSearch();

            result.$promise.then(function (data) {
              console.log('got tne facet set for au')

              /**
               * Add the author array to shared context.
               * @type {string|Array|*}
               */
              AppContext.setAuthorsList(data.facets);

              data.count = AppContext.getAuthorsCount();
              end = Utils.getPageListCount(data.count, setSize);
              data.results = Utils.authorArraySlice(QueryManager.getOffset(), QueryManager.getOffset() + end);

              updateParentNewSet(data);
            });
          } else {


            data.count = AppContext.getAuthorsCount();
            end = Utils.getPageListCount(data.count, setSize);
            data.results = Utils.authorArraySlice(QueryManager.getOffset(), QueryManager.getOffset() + end);
            updateParent(data);
            console.log(data)
          }

        } else if (QueryManager.isSubjectListRequest()) {
          if (isNewSet) {
            var result = doSearch();
            result.$promise.then(function (data) {
              /**
               * Add the author array to shared context.
               * @type {string|Array|*}
               */
              AppContext.setSubjectList(data.facets);

              data.count = AppContext.getSubjectsCount();
              end = Utils.getPageListCount(data.count, setSize);
              data.results = Utils.subjectArraySlice(QueryManager.getOffset(), QueryManager.getOffset() + end);
              updateParentNewSet(data);
            });
          } else {
            console.log('using pager')
            data.count = AppContext.getSubjectsCount();
            end = Utils.getPageListCount(data.count, setSize);
            data.results = Utils.subjectArraySlice(QueryManager.getOffset(), QueryManager.getOffset() + end);
            console.log(data)
            updateParent(data);
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

      console.log('init pager')
      console.log(qs);

      if (Object.keys(qs).length !== 0) {
        QueryManager.setQueryType(qs.field);
        QueryManager.setSort(qs.sort);
      }

      defaultField = QueryManager.getQueryType();
      defaultOrder = QueryManager.getSort();

      if (AppContext.getDiscoveryContext() !== DiscoveryContext.ADVANCED_SEARCH) {
        updateList(QueryManager.getOffset(), false);
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
      onNewSet: '&'
    },
    controller: PagerCtrl

  });

})();
