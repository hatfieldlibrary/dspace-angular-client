/**
 * Created by mspalti on 2/29/16.
 */

'use strict';

(function () {

  /**
   * Controller for sort options.
   * @param $scope
   * @param $location
   * @param $timeout
   * @param $mdMedia
   * @param CollectionQueryFieldMap
   * @param BrowseQueryFieldMap
   * @param ListSortOrderMap
   * @param Utils
   * @param Messages
   * @param QuerySort
   * @param QueryFields
   * @param QueryTypes
   * @param AppContext
   * @param AppConfig
   * @param QueryManager
   * @param SolrDataLoader
   * @constructor
   */
  function SortOptionsCtrl($scope,
                           $location,
                           $timeout,
                           $mdMedia,
                           CollectionQueryFieldMap,
                           BrowseQueryFieldMap,
                           ListSortOrderMap,
                           Utils,
                           Messages,
                           QuerySort,
                           QueryFields,
                           QueryTypes,
                           AppContext,
                           AppConfig,
                           QueryManager,
                           SolrDataLoader) {

    var ctrl = this;

    var defaultField;

    var defaultOrder;

    ctrl.fieldLabel = Messages.SORT_BY_FIELD_LABEL;

    ctrl.orderLabel = Messages.SORT_ORDER_LABEL;

    /**
     * The end value is used to get a slice from the author array.
     * @type {number}
     */
    var setSize = AppConfig.RESPONSE_SET_SIZE;

    /**
     * Set default display list type to TITLE.
     * @type {string}
     */
    var displayListType = QueryFields.DATE;

    /**
     * The AssetType (collection)
     */
    ctrl.type = QueryManager.getAssetType();
    /**
     * The Asset Id (DSpace Id)
     */
    ctrl.id = QueryManager.getAssetId();

    /**
     * Label/Value map for the sort order.
     * @type {Array}
     */
    ctrl.orders = ListSortOrderMap.order;

    /**
     * The current sort order.
     */
    ctrl.selectedOrder = QueryManager.getSort();
    /**
     * The current query filter.
     */
    ctrl.filterTerms = QueryManager.getFilter();

    if (($mdMedia('sm') || $mdMedia('xs'))) {
      ctrl.fieldSelectorWidth = '50';
      ctrl.filterWidth = '50';

    } else {
      ctrl.fieldSelectorWidth = '33';
      ctrl.filterWidth = '66';

    }

    /**
     * Watch for changes to query type triggered by a
     * query string update.
     */
    $scope.$watch(function () {
        return QueryManager.getQueryType();
      },
      function (newValue, oldValue) {
        if (newValue !== oldValue) {
          ctrl.selectedField = newValue;
          // Since we are not CURRENTLY tracking filtere
          // terms in history, reset the bound values
          // to empty string.
          ctrl.filterTerms = '';
        }
      });

    /**
     * Watch for changes to sort order triggered by a
     * query string update.
     */
    $scope.$watch(function () {
        return QueryManager.getSort();
      },
      function (newValue, oldValue) {
        if (newValue !== oldValue) {
          ctrl.selectedOrder = newValue;

          ctrl.filterTerms = '';
        }
      });

    function init() {

      /**
       * Label/Value map for query fields (title, author, subject, date)
       * @type {*[]}
       */
      if (ctrl.context === 'collection') {
        ctrl.fields = CollectionQueryFieldMap.fields;
        /**
         * The selected field is initialized to title.
         * @type {string}
         */
        ctrl.selectedField = QueryManager.getQueryType();

      }
      else if (ctrl.context === 'browse') {
        ctrl.fields = BrowseQueryFieldMap.fields;
        /**
         * The selected field is initialized to title.
         * @type {string}
         */
        ctrl.selectedField = BrowseQueryFieldMap.fields[0].value;
      }

      /**
       * The search object will be empty on initial load.
       */
      if (Object.keys($location.search()).length === 0) {
        /**
         * The default placeholder message for the filter query.
         * @type {string}
         */
        ctrl.placeholder = Messages.SORT_JUMP_TO_YEAR_LABEL;
      }

      /**
       * Author and subject facets execute a new search
       */
      if (ctrl.selectedField === QueryTypes.SUBJECT_FACETS ||
        ctrl.selectedField === QueryTypes.AUTHOR_FACETS) {
        ctrl.placeholder = Utils.placeholderMessage(ctrl.selectedField);
      }
    }

    init();


    /**
     * Executes filter query.
     */
    var doJump = function () {

      AppContext.setOpenItem(-1);

      console.log(QueryManager.getOffset())

      var filter = SolrDataLoader.filterQuery();
      filter.$promise.then(function (data) {

        if (typeof data.results !== 'undefined') {

          ctrl.resetListView();
          QueryManager.setOffset(data.offset);
          AppContext.setStartIndex(data.offset);
          /**
           * Update parent component.
           */
          ctrl.onUpdate({
            results: data.results,
            count: data.count,
            field: displayListType,
            offset: data.offset,
            jump: true

          });
        }

      });

    };

    $scope.$on('$locationChangeSuccess', function () {

      var qs = $location.search();

      if (Object.keys(qs).length !== 0) {
        if (qs.field === QueryTypes.SUBJECT_FACETS ||
          qs.field === QueryTypes.AUTHOR_FACETS) {

          defaultField = qs.field;
          defaultOrder = qs.sort;

          QueryManager.setQueryType(qs.field);
          QueryManager.setSort(qs.sort);

        }
      }

    });

    /**
     * Executes query to retrieve a fresh result set.
     */
    var doSearch = function () {
      /**
       * Set pager in context.  (The pager component will
       * hide the pager button.)
       */
      AppContext.setPager(false);
      AppContext.setStartIndex(0);


      /**
       * Using a hybrid approach here.  If an id exists
       * in the query string, we just update the location
       * search string and let pager do the work.
       *
       * If an id does not exist in the query string, then
       * execute the search from here.
       * @type {Number|*}
       */
      var qs = $location.search();
      // update the location and let pager pick up the change
      if (typeof qs.id !== 'undefined') {
        delete qs.pos;
        delete qs.id;
        $location.search(qs);
      }
      // execute search from here
      else {
        /**
         * Get promise.
         * @type {*|{method}|Session}
         */
        var items = SolrDataLoader.invokeQuery();
        /**
         * Handle the response.
         */
        items.$promise.then(function (data) {
          ctrl.resetListView();
          QueryManager.setOffset(data.offset);
          /**
           * Update parent component.
           */
          ctrl.onUpdate({
            results: data.results,
            count: data.count,
            field: displayListType,
            offset: data.offset,
            jump: true
          });
        });

      }
    };


    /**
     * Toggle the sort order (ASCENDING, DESCENDING)
     */
    ctrl.resetOrder = function () {

      AppContext.isNewSet(true);

      ctrl.resetListView();
      /**
       * Reset the selected item.
       */
      AppContext.setSelectedPositionIndex(-1);

      $location.search({
        'field': ctrl.selectedField,
        'sort': ctrl.selectedOrder,
        'terms': ctrl.filterTerms,
        'offset': 0
      });


    };


    /**
     * Filter the search results.
     */
    ctrl.getFilter = function () {

      AppContext.isNewSet(false);

      // $location.search({
      //   'field': ctrl.selectedField,
      //   'sort': ctrl.selectedOrder,
      //   'terms': ctrl.filterTerms,
      //   'offset': 0
      // });

      /**
       * Reset the selected item.
       */
      AppContext.setSelectedPositionIndex(-1);

      /**
       * Get the current query type.
       */
      var queryType = QueryManager.getQueryType();


      /**
       * When filtering for titles and dates, we use distinct solr queries
       * (START_LETTER and START_DATE).
       *
       * For authors and subjects, we can use the same query type
       * used elsewhere (AUTHOR_FACETS and SUBJECT_FACETS).
       *
       * Setting the filter search type in QueryManager.
       */
      if (queryType === QueryTypes.TITLES_LIST) {

        QueryManager.setJumpType(QueryTypes.START_LETTER);

      } else if (queryType === QueryTypes.DATES_LIST) {

        QueryManager.setJumpType(QueryTypes.START_DATE);

      } else if (queryType === QueryTypes.ITEMS_BY_SUBJECT) {

        QueryManager.setJumpType(QueryTypes.START_LETTER);

      } else if (queryType === QueryTypes.AUTHOR_FACETS) {

        QueryManager.setJumpType(QueryTypes.AUTHOR_FACETS);

      } else if (queryType === QueryTypes.SUBJECT_FACETS) {

        QueryManager.setJumpType(QueryTypes.SUBJECT_FACETS);

      }

      /**
       * Slight delay before executing the search.
       */
      $timeout(function () {

        var remaining;

        var offset;

        if (QueryManager.getJumpType() === QueryTypes.START_LETTER) {
          /**
           * If we have a filter term, so filter query.
           */
          if (ctrl.filterTerms.length > 0) {
            QueryManager.setFilter(ctrl.filterTerms);
            doJump();

          }
          /**
           * If the filter is removed by the user, do original search
           * and return the values to update the view
           */
          else {
            QueryManager.setOffset(0);
            doSearch();
          }
        }

        else if (QueryManager.getJumpType() === QueryTypes.START_DATE) {
          /**
           * For dates, only filter on the year.
           */
          if (ctrl.filterTerms.length === 4) {
            QueryManager.setFilter(ctrl.filterTerms);
            doJump();

          }
          /**
           * If the filter is removed, do new search and
           * update the view as with items.
           */
          else if (ctrl.filterTerms.length === 0) {
            QueryManager.setOffset(0);
            doSearch();
          }
        }

        else if (QueryManager.getQueryType() === QueryTypes.AUTHOR_FACETS) {
          /**
           * Find the index of the first matching item.
           */
          offset = Utils.findIndexInArray(AppContext.getAuthors(), ctrl.filterTerms);
          QueryManager.setOffset(offset);
          remaining = Utils.getPageListCount(AppContext.getAuthorsCount(), setSize);
          AppContext.setStartIndex(offset);
          /**
           * Update view here.
           */
          ctrl.onUpdate({
            results: Utils.facetsArraySlice(QueryTypes.AUTHOR_FACETS, offset, offset + remaining),
            count: AppContext.getAuthorsCount(),
            field: QueryFields.AUTHOR,
            offset: offset,
            jump: true
          });

        }
        else if (QueryManager.getQueryType() === QueryTypes.SUBJECT_FACETS) {

          /**
           * Find the index of the first matching item.
           */
          offset = Utils.findIndexInArray(AppContext.getSubjects(), ctrl.filterTerms);
          QueryManager.setOffset(offset);
          remaining = Utils.getPageListCount(AppContext.getSubjectsCount(), setSize);
          AppContext.setStartIndex(offset);
          /**
           * Update view here.
           */
          ctrl.onUpdate({
            results: Utils.facetsArraySlice(QueryTypes.SUBJECT_FACETS, offset, offset + remaining),
            count: AppContext.getSubjectsCount(),
            field: QueryFields.SUBJECT,
            offset: offset,
            jump: true
          });

        }
      }, 100);


    };

    /**
     * Set search results to a new field (title, author, date, subject).
     */
    ctrl.resetField = function setField() {


      AppContext.isNewSet(true);

      AppContext.setOpenItem(-1);
      /**
       * Reset the selected item.
       */
      AppContext.setSelectedPositionIndex(-1);
      /**
       * Reset the filter.
       * @type {string}
       */
      ctrl.filterTerms = '';
      /**
       * Set the QueryType (identifies the solr query to be used).
       */
      QueryManager.setQueryType(ctrl.selectedField);


      /**
       * Set the placeholder message based on query type.
       */
      ctrl.placeholder = Utils.placeholderMessage(ctrl.selectedField);

      /**
       * New offset should be 0.
       */
      QueryManager.setOffset(0);
      /**
       * The initial sort order should be ASCENDING.
       */
      QueryManager.setSort(QuerySort.ASCENDING);
      /**
       * Since subjects and authors toggle the array of facets, order
       * is tracked separately for these fields.
       */
      if (ctrl.field === QueryTypes.AUTHOR_FACETS) {
        AppContext.setAuthorsOrder(QuerySort.ASCENDING);
      } else if (ctrl.field === QueryTypes.SUBJECT_FACETS) {
        AppContext.setSubjectsOrder(QuerySort.ASCENDING);
      } else {
        AppContext.setListOrder(QuerySort.ASCENDING);
      }

      /**
       * Update the select option.
       */
      ctrl.selectedOrder = QuerySort.ASCENDING;

      /**
       * Update query string.
       */
      $location.search({
        'field': ctrl.selectedField,
        'sort': ctrl.selectedOrder,
        'terms': ctrl.filterTerms,
        'offset': 0
      });

    };

  }

  dspaceComponents.component('sortOptionsComponent', {

    bindings: {
      onUpdate: '&',
      resetListView: '&',
      context: '@'
    },
    templateUrl: '/ds/shared/templates/loaders/sortOptions.html',
    controller: SortOptionsCtrl

  });

})();
