/**
 * Created by mspalti on 2/23/16.
 */

'use strict';

(function () {

  function PagerCtrl($scope,
                     $timeout,
                     SolrQuery,
                     SolrBrowseQuery,
                     Utils,
                     QueryManager,
                     AppContext,
                     QueryActions) {


    var ctrl = this;

    /**
     * Number of items to return in pager.
     * @type {number}
     */
    var setSize = 20;
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
        return AppContext.getPager()
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


      /**
       * Update the query stack. Subsequent paging
       * requests to not update the stack.
       */

      updateList(QueryManager.getOffset());


    }

    init();


    /**
     * Execute node REST API call for solr query results.
     * @param start the start position for query result.
     */
    function updateList(newOffset) {

      QueryManager.setOffset(newOffset);

      var action = QueryManager.getAction();

      displayListType = Utils.getFieldForQueryType();

      /**
       * For items, we need to make a new solr query for the next
       * result set.
       *
       * Here, we check to be sure the current query is not for authors
       * or subjects.
       */
      if (!QueryManager.isAuthorListRequest() && !QueryManager.isSubjectListRequest()) {

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
         * Discovery query: POST.
         */
        else if (action === QueryActions.SEARCH && QueryManager.getSearchTerms() !== undefined) {

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

        if (items !== undefined) {

          items.$promise.then(function (data) {
            /** Handle result of the solr query. */
            updateParent(data);

          });
        }

      }
      /**
       * List author and subject.
       */
      else {

        var data = [];

        /**
         * For authors or subjects, get next results from the facets
         * array rather than executing a new solr query.  This is always
         * safe since the author and subject facets are retrieved by
         * the sortOptions loader.
         */
        if (QueryManager.isAuthorListRequest()) {
          data.count = AppContext.getAuthorsCount();
          var end = Utils.getPageListCount(data.count, setSize);
          data.results = Utils.authorArraySlice(QueryManager.getOffset(), QueryManager.getOffset() + end);

        } else if (QueryManager.isSubjectListRequest()) {
          data.count = AppContext.getSubjectsCount();
          // In JavaScript, variables live at the function level, not the block level.
          // Declaring the 'end' variable here would be a duplicate declaration.
          // JavaScript 1.7 has a let declaration for block level scope.  Not currently supported.
          end = Utils.getPageListCount(data.count, setSize);
          data.results = Utils.subjectArraySlice(QueryManager.getOffset(), QueryManager.getOffset() + end);

        }

        updateParent(data);

      }


    }

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
     * View model method for retrieving the previous result set.
     */
    ctrl.previous = function () {

      var start = QueryManager.getOffset();

      if (start >= setSize) {
        ctrl.start -= setSize;
        ctrl.end = ctrl.start + 9;
        start -= setSize;
        QueryManager.setOffset(start);
        updateList(start);
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
      updateList(start);

    };

  }


  dspaceComponents.component('pagerComponent', {

    template: '<div layout="row" layout-align="center center" ng-if="$ctrl.showPager"><md-button class="md-raised md-accent md-fab md-mini" ng-click="$ctrl.next()" ng-if="$ctrl.more()"><md-icon md-font-library="material-icons" class="md-light" aria-label="More Results">expand_more</md-icon></md-button></div>',

    bindings: {
      onUpdate: '&'

    },
    controller: PagerCtrl

  });

})();
