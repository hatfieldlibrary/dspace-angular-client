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
  function SortOptionsCtrl($timeout,
                           SolrQuery,
                           SolrJumpToQuery,
                           CollectionQueryFieldMap,
                           BrowseQueryFieldMap,
                           ListSortOrderMap,
                           Utils,
                           QuerySort,
                           QueryFields,
                           QueryTypes,
                           QueryManager) {

    var ctrl = this;

    /**
     * The start position for results returned by solr.
     * @type {number}
     */
    var start = 0;
    /**
     * The end value is used to get a slice from the author array.
     * @type {number}
     */
    var setSize = 10;
    

    /**
     * Set default display list type to TITLE.
     * @type {string}
     */
    var displayListType = QueryFields.TITLE;

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
      ctrl.selectedField = CollectionQueryFieldMap.fields[0].value;

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


    /**
     * The default placeholder message for the filter query.
     * @type {string}
     */
    ctrl.placeholder = 'Jump to Letter';

    /**
     * Toggle the sort order (ASCENDING, DESCENDING)
     */
    ctrl.resetOrder = function () {

      /**
       * Reset the selected item.
       */
      QueryManager.setCurrentIndex(-1);

      /**
       * Set sort order to the new selected value.
       */
      QueryManager.setSort(ctrl.selectedOrder);

      /**
       * Set the offset to zero.
       */
      QueryManager.setOffset(0);

      ctrl.filterTerms = '';

      /**
       * Author sort.
       */
      if (QueryManager.getQueryType() === QueryTypes.AUTHOR_FACETS) {

        QueryManager.setOffset(0);
        var arr = QueryManager.getAuthors();
        // Reverse the author array.
        Utils.reverseArray(arr);
        QueryManager.setAuthorsList(arr);
        var data = {};
        data.results = Utils.authorArraySlice(QueryManager.getOffset(), QueryManager.getOffset() + 10);
        data.count = QueryManager.getAuthorsCount();

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
        var arr = QueryManager.getSubjects();
        // Reverse the subject array.
        Utils.reverseArray(arr);
        QueryManager.setSubjectList(arr);
        var data = {};
        data.results = Utils.subjectArraySlice(QueryManager.getOffset(), QueryManager.getOffset() + 10);
        data.count = QueryManager.getSubjectsCount();

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

        /**
         * Changing the sort order for other query types requires a
         * new solr query.
         */
        doSearch();
      }

    };


    /**
     * Filter the search results.
     */
    ctrl.getFilter = function () {

      /**
       * Reset the selected item.
       */
      QueryManager.setCurrentIndex(-1);

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

      } else if (queryType === QueryTypes.AUTHOR_FACETS) {

        QueryManager.setJumpType(QueryTypes.AUTHOR_FACETS);

      } else if (queryType === QueryTypes.SUBJECT_FACETS) {

        QueryManager.setJumpType(QueryTypes.SUBJECT_FACETS);

      }

      /**
       * Slight delay before executing the search.
       */
      $timeout(function () {


        if (QueryManager.getJumpType() === QueryTypes.START_LETTER) {
          /**
           * If we have a filter term, so filter query.
           */
          if (ctrl.filterTerms.length > 0) {
            console.log('setting filter ' + ctrl.filterTerms)
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
          var offset = Utils.findIndexInArray(QueryManager.getAuthors(), ctrl.filterTerms);
          QueryManager.setOffset(offset);
          var remaining = Utils.getPageListCount(QueryManager.getAuthorsCount(), setSize);
          /**
           * Update view here.
           */
          ctrl.onUpdate({
            results: Utils.authorArraySlice(offset, offset + remaining),
            count: QueryManager.getAuthorsCount(),
            field: QueryFields.AUTHOR
          });

        }
        else if (QueryManager.getQueryType() === QueryTypes.SUBJECT_FACETS) {
          /**
           * Find the index of the first matching item.
           */
          var offset = Utils.findIndexInArray(QueryManager.getSubjects(), ctrl.filterTerms);
          QueryManager.setOffset(offset);
          var remaining = Utils.getPageListCount(QueryManager.getSubjectsCount(), setSize);
          /**
           * Update view here.
           */
          ctrl.onUpdate({
            results: Utils.subjectArraySlice(offset, offset + remaining),
            count: QueryManager.getSubjectsCount(),
            field: QueryFields.SUBJECT
          });

        }
      }, 100);


    };

    /**
     * Set search results to a new field (title, author, date, subject).
     */
    ctrl.resetField = function setField() {


      /**
       * Reset the selected item.
       */
      QueryManager.setCurrentIndex(-1);
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
       * The intial sort order should be ASCENDING.
       */
      QueryManager.setSort(QuerySort.ASCENDING);
      ctrl.selectedOrder = QuerySort.ASCENDING;

      /**
       * Do a new search.
       */
      doSearch();

    };


    /**
     * Executes filter query.
     */
    var doJump = function () {

      /**
       * Get promise.
       * @type {*|{method}|Session}
       */
      var items = SolrJumpToQuery.save({
        params: QueryManager.context.query

      });
      /**
       * Handle the response.
       */
      items.$promise.then(function (data) {
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


    /**
     * Executes query to retrieve a fresh result set.
     */
    var doSearch = function () {
      console.log(QueryManager.context.query);
      /**
       * Get promise.
       * @type {*|{method}|Session}
       */
      var items = SolrQuery.save({
        params: QueryManager.context.query

      });
      /**
       * Handle the response.
       */
      items.$promise.then(function (data) {
        console.log(data)
        QueryManager.setOffset(data.offset);
        handleResult(data);
      });
    };


    /**
     * Handle the result of queries for field queries. This function exists
     * to preprocess data from author and subject results before sending the
     * to the parent component.
     * @param data
     */
    function handleResult(data) {


      if (QueryManager.isAuthorListRequest()) {

        displayListType = QueryFields.AUTHOR;

        /**
         * Add the author array to shared context.
         * @type {string|Array|*}
         */
        QueryManager.setAuthorsList(data.facets);

        /**
         * Total item is authors list.
         */
        data.count = QueryManager.getAuthorsCount();
        /**
         * The count of items remaining in list.
         * @type {*}
         */
        var end = Utils.getPageListCount(data.count, setSize);


        /** Add authors to the current result set. */
        data.results = Utils.authorArraySlice(start, start + end);


      }

      else if (QueryManager.isSubjectListRequest()) {

        displayListType = QueryFields.SUBJECT;

        /**
         * Add the author array to shared context.
         * @type {string|Array|*}
         */
        QueryManager.setSubjectList(data.facets);

        /**
         * Total items in subject list.
         */
        data.count = QueryManager.getSubjectsCount();

        /**
         * The count of items remaining in list.
         * @type {*}
         */
        var end = Utils.getPageListCount(data.count, setSize);

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

      QueryManager.setCount(data.count);

      /**
       * Update parent component.
       */
      ctrl.onUpdate({
        results: data.results,
        count: data.count,
        field: displayListType
      });


    }


  }

  dspaceComponents.component('sortOptionsComponent', {

    bindings: {
      // callback function
      onUpdate: '&',
      context: '@'
    },
    templateUrl: '/shared/templates/sortOptions.html',
    controller: SortOptionsCtrl

  });

})
();
