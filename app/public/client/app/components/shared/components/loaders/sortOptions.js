/**
 * Created by mspalti on 2/29/16.
 */

'use strict';

(function () {

  /**
   * Controller for the sort options component that is included in
   * the parent itemList component.
   * @param SolrQuery
   * @param ListQueryFieldMap
   * @param Utils
   * @param QuerySort
   * @param QueryManager
   * @constructor
   */
  function SortOptionsCtrl($scope,
                           $location,
                           $timeout,
                           $mdMedia,
                           SolrQuery,
                           SolrJumpToQuery,
                           CollectionQueryFieldMap,
                           BrowseQueryFieldMap,
                           ListSortOrderMap,
                           Utils,
                           Messages,
                           QuerySort,
                           QueryFields,
                           QueryTypes,
                           QueryActions,
                           AppContext,
                           QueryManager) {

    var ctrl = this;

    var defaultField;

    var defaultOrder;

    ctrl.fieldLabel = Messages.SORT_BY_FIELD_LABEL;

    ctrl.orderLabel = Messages.SORT_ORDER_LABEL;

    /**
     * The start position for results returned by solr.
     * @type {number}
     */
    var start = 0;
    /**
     * The end value is used to get a slice from the author array.
     * @type {number}
     */
    var setSize = 20;


    ctrl.filterTerms = '';

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
     * Label/Value map for the sort order.
     * @type {Array}
     */
    ctrl.orders = ListSortOrderMap.order;

    /**
     * The current sort order.
     */
    ctrl.selectedOrder = QueryManager.getSort();

    ctrl.filterTerms = QueryManager.getFilter();

    if (($mdMedia('sm') || $mdMedia('xs'))) {
      ctrl.fieldSelectorWidth = '50';
      ctrl.filterWidth = '50';

    } else {
      ctrl.fieldSelectorWidth = '33';
      ctrl.filterWidth = '66';

    }

    function init() {

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
        ctrl.placeholder = Utils.placeholderMessage(ctrl.selectedField)
      }
    }

    init();


    /**
     * Handle the result of field queries. This function exists
     * to pre-process data from author and subject results before sending
     * to the parent component.
     * @param data
     */
    function handleResult(data) {

      var end;

      if (QueryManager.isAuthorListRequest()) {

        displayListType = QueryFields.AUTHOR;

        /**
         * Add the author array to shared context.
         * @type {string|Array|*}
         */
        AppContext.setAuthorsList(data.facets);

        /**
         * Total item is authors list.
         */
        data.count = AppContext.getAuthorsCount();
        /**
         * The count of items remaining in list.
         * @type {*}
         */
        end = Utils.getPageListCount(data.count, setSize);


        /** Add authors to the current result set. */
        data.results = Utils.authorArraySlice(start, start + end);


      }

      else if (QueryManager.isSubjectListRequest()) {

        displayListType = QueryFields.SUBJECT;

        /**
         * Add the author array to shared context.
         * @type {string|Array|*}
         */
        AppContext.setSubjectList(data.facets);

        /**
         * Total items in subject list.
         */
        data.count = AppContext.getSubjectsCount();

        /**
         * The count of items remaining in list.
         * @type {*}
         */
        end = Utils.getPageListCount(data.count, setSize);

        /** Add subjects to the current result set. */
        data.results = Utils.subjectArraySlice(start, start + end);

      }
      else {
        /**
         * Fields other than author and subject use the title list type
         * @type {string}
         */
        displayListType = QueryFields.TITLE;

      }

      AppContext.setCount(data.count);
      /**
       * Update parent component.
       */
      ctrl.onUpdate({
        results: data.results,
        count: data.count,
        field: displayListType
      });

      $timeout(function () {
        /**
         * Set pager in context.  (The pager component
         * will show the pager button.)
         */
        AppContext.setPager(true);
      }, 300);

    }

    /**
     * Executes filter query.
     */
    var doJump = function () {

      /**
       * Get promise.
       * @type {*|{method}|Session}
       */
      var items = SolrJumpToQuery.save({
        params: QueryManager.getQuery()
      });
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
          field: displayListType
        });
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

          // Is this correct???
          //doSearch();
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

      /**
       * Get promise.
       * @type {*|{method}|Session}
       */
      var items = SolrQuery.save({
        params: QueryManager.getQuery()

      });
      /**
       * Handle the response.
       */
      items.$promise.then(function (data) {
        ctrl.resetListView();
        QueryManager.setOffset(data.offset);
        handleResult(data);
      });
    };

    /**
     * Toggle the sort order (ASCENDING, DESCENDING)
     */
    ctrl.resetOrder = function () {


      $location.search({'field': ctrl.selectedField, 'sort': ctrl.selectedOrder, 'terms': ctrl.filterTerms});


      ctrl.resetListView();

      /**
       * Reset the selected item.
       */
      AppContext.setCurrentIndex(-1);

      /**
       * Set sort order to the new selected value.
       */
      QueryManager.setSort(ctrl.selectedOrder);

      /**
       * Set the offset to zero.
       */
      QueryManager.setOffset(0);

      var arr = [];

      var data = {};

      /**
       * Author sort.
       */
      if (QueryManager.getQueryType() === QueryTypes.AUTHOR_FACETS) {

        QueryManager.setOffset(0);
        arr = AppContext.getAuthors();
        // Reverse the author array.
        Utils.reverseArray(arr);
        AppContext.setAuthorsList(arr);
        data.results = Utils.authorArraySlice(QueryManager.getOffset(), QueryManager.getOffset() + setSize);
        data.count = AppContext.getAuthorsCount();

        /**
         * Update parent component.
         */
        ctrl.onUpdate({
          results: data.results,
          count: data.count,
          field: QueryFields.AUTHOR
        });

      }
      /**
       * Subject sort.
       */
      else if (QueryManager.getQueryType() === QueryTypes.SUBJECT_FACETS) {

        QueryManager.setOffset(0);
        arr = AppContext.getSubjects();
        // Reverse the subject array.
        Utils.reverseArray(arr);
        AppContext.setSubjectList(arr);
        data.results = Utils.subjectArraySlice(QueryManager.getOffset(), QueryManager.getOffset() + setSize);
        data.count = AppContext.getSubjectsCount();

        /**
         * Update parent component.
         */
        ctrl.onUpdate({
          results: data.results,
          count: data.count,
          field: QueryFields.SUBJECT
        });

      }
      else {

        // QueryStack.replaceWith(QueryManager.context.query);
        // QueryStack.print();

        /**
         * Changing the sort order for other query types requires a
         * new solr query.
         */
        // doSearch();
      }

    };


    /**
     * Filter the search results.
     */
    ctrl.getFilter = function () {

      $location.search({'field': ctrl.selectedField, 'sort': ctrl.selectedOrder, 'terms': ctrl.filterTerms});

      /**
       * Reset the selected item.
       */
      AppContext.setCurrentIndex(-1);

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

      } else if (queryType === QueryTypes.SUBJECT_SEARCH) {

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
          /**
           * Update view here.
           */
          ctrl.onUpdate({
            results: Utils.authorArraySlice(offset, offset + remaining),
            count: AppContext.getAuthorsCount(),
            field: QueryFields.AUTHOR
          });

        }
        else if (QueryManager.getQueryType() === QueryTypes.SUBJECT_FACETS) {
          /**
           * Find the index of the first matching item.
           */
          offset = Utils.findIndexInArray(AppContext.getSubjects(), ctrl.filterTerms);
          QueryManager.setOffset(offset);
          remaining = Utils.getPageListCount(AppContext.getSubjectsCount(), setSize);
          /**
           * Update view here.
           */
          ctrl.onUpdate({
            results: Utils.subjectArraySlice(offset, offset + remaining),
            count: AppContext.getSubjectsCount(),
            field: QueryFields.SUBJECT
          });

        }
      }, 100);


      // QueryStack.replaceWith(QueryManager.context.query);
      // QueryStack.print();
    };

    /**
     * Set search results to a new field (title, author, date, subject).
     */
    ctrl.resetField = function setField() {


      /**
       * Reset the selected item.
       */
      AppContext.setCurrentIndex(-1);
      /**
       * Reset the filter.
       * @type {string}
       */
      ctrl.filterTerms = '';
      /**
       * Set the QueryType (identifies the solr query to be used).
       */
      QueryManager.setQueryType(ctrl.selectedField);

      console.log(ctrl.selectedField)
      /**
       * Set the placeholder message based on query type.
       */
      ctrl.placeholder = Utils.placeholderMessage(ctrl.selectedField);


      /**
       * New offset should be 0.
       */
      QueryManager.setOffset(0);
      /**
       * The intial sort order should be ASCENDING.
       */
      QueryManager.setSort(QuerySort.ASCENDING);
      ctrl.selectedOrder = QuerySort.ASCENDING;


      // QueryStack.replaceWith(QueryManager.context.query);
      // QueryStack.print();

      $location.search({'field': ctrl.selectedField, 'sort': ctrl.selectedOrder, 'terms': ctrl.filterTerms});

      /**
       * Do a new search.
       */
      if (ctrl.selectedField === QueryTypes.AUTHOR_FACETS ||
        ctrl.selectedField === QueryTypes.SUBJECT_FACETS) {
        doSearch();
      }

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

})
();
