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
                           ListQueryFieldMap,
                           ListSortOrderMap,
                           Utils,
                           QuerySort,
                           QueryFields,
                           QueryTypes,
                           QueryManager) {

    var ctrl = this;


    ctrl.filterTerms = '';

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

    var displayListType = QueryFields.TITLE;

    ctrl.type = QueryManager.getAssetType();
    ctrl.id = QueryManager.getAssetId();

    /**
     * The select fields view model.
     * @type {*[]}
     */
    ctrl.fields = ListQueryFieldMap.fields;

    ctrl.orders = ListSortOrderMap.order;

    ctrl.selectedOrder = QueryManager.getSort();


    /**
     * The selected field. Initialize to title.
     * @type {string}
     */
    ctrl.selectedField = ListQueryFieldMap.fields[0].value;

    ctrl.resetOrder = function () {


      QueryManager.setCurrentIndex(-1);

      QueryManager.setSort(ctrl.selectedOrder);

      QueryManager.setSearchTerms('');

      QueryManager.setOffset(0);

      ctrl.filterTerms = '';

      if (QueryManager.getQueryType() === QueryTypes.AUTHOR_FACETS) {

        QueryManager.setOffset(0);
        var arr = QueryManager.getAuthors();
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
      else if (QueryManager.getQueryType() === QueryTypes.SUBJECT_FACETS) {

        QueryManager.setOffset(0);
        var arr = QueryManager.getSubjects();
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


        doSearch();
      }

    };

    ctrl.placeholder = 'Jump to Letter';

    function placeholderMessage() {
      if (QueryManager.getQueryType() === QueryTypes.DATES_LIST) {
        ctrl.placeholder = 'Enter Year';
      }
      else if (QueryManager.getQueryType() === QueryTypes.TITLES_LIST) {
        ctrl.placeholder = 'Jump to Letter';
      }
      else if (QueryManager.getQueryType() === QueryTypes.SUBJECT_FACETS ||
        QueryManager.getQueryType() === QueryTypes.AUTHOR_FACETS) {
        ctrl.placeholder = 'Jump to Letter';
      }
    }

    ctrl.getFilter = function () {

      QueryManager.setCurrentIndex(-1);

      var queryType = QueryManager.getQueryType();

      if (queryType === QueryTypes.TITLES_LIST) {

        QueryManager.setJumpType(QueryTypes.START_LETTER);

      } else if (queryType === QueryTypes.DATES_LIST) {

        QueryManager.setJumpType(QueryTypes.START_DATE);

      } else if (queryType === QueryTypes.AUTHOR_FACETS) {

        QueryManager.setJumpType(QueryTypes.AUTHOR_FACETS);

      } else if (queryType === QueryTypes.SUBJECT_FACETS) {

        QueryManager.setJumpType(QueryTypes.SUBJECT_FACETS);

      }

      $timeout(function () {

        if (QueryManager.getJumpType() === QueryTypes.START_LETTER) {
          if (ctrl.filterTerms.length > 0) {
            QueryManager.setSearchTerms(ctrl.filterTerms);
            doJump();

          } else {
            QueryManager.setOffset(0);
            doSearch();
          }
        }
        else if (QueryManager.getJumpType() === QueryTypes.START_DATE) {
          if (ctrl.filterTerms.length === 4) {
            QueryManager.setSearchTerms(ctrl.filterTerms);
            doJump();

          } else if (ctrl.filterTerms.length === 0) {
            QueryManager.setOffset(0);
            doSearch();
          }
        }
        else if (QueryManager.getQueryType() === QueryTypes.AUTHOR_FACETS) {

          var offset = findIndexInArray(QueryManager.getAuthors(), ctrl.filterTerms, 'author');
          QueryManager.setOffset(offset);
          ctrl.onUpdate({
            results: Utils.authorArraySlice(offset, offset + 10),
            count: QueryManager.getAuthorsCount(),
            field: QueryFields.AUTHOR
          });

        }
        else if (QueryManager.getQueryType() === QueryTypes.SUBJECT_FACETS) {

          var offset = findIndexInArray(QueryManager.getSubjects(), ctrl.filterTerms, 'subject');
          QueryManager.setOffset(offset);
          ctrl.onUpdate({
            results: Utils.subjectArraySlice(offset, offset + 10),
            count: QueryManager.getSubjectsCount(),
            field: QueryFields.SUBJECT
          });

        }
      }, 100);


    };

    function findIndexInArray(arr, letters, type) {

      console.log(letters)

      if (letters.length > 0) {
        var regex = new RegExp('^' + letters, 'i');
        console.log(regex);

        for (var i = 0; i < arr.length; i++) {

          if (arr[i]['value'].match(regex) !== null) {
            return i;
          }
        }
      }
      return 0;
    }

    ctrl.resetField = function setField() {

      QueryManager.setCurrentIndex(-1);

      /**
       * Set the QueryType (identifies the solr query to be used).
       */
      QueryManager.setQueryType(ctrl.selectedField);
      QueryManager.setOffset(0);
      QueryManager.setSort(QuerySort.ASCENDING);
      ctrl.selectedOrder = QuerySort.ASCENDING;
      placeholderMessage();
      ctrl.filterTerms = '';
      doSearch();
    };


    var doJump = function () {

      var items = SolrJumpToQuery.save({
        params: QueryManager.context.query

      });
      items.$promise.then(function (data) {
        QueryManager.setOffset(data.offset);
        processResult(data);

      });

    };


    /**
     * Update the view model after user selects new browse by field option.
     */
    var doSearch = function () {

      /**
       * Return offset to zero in case user has paged through
       * a previous result list.
       */
      //QueryManager.setOffset(0);

      /**
       * Do the query.
       * @type {Session|*|{method}}
       */
      var items = SolrQuery.save({

        params: QueryManager.context.query

      });
      /**
       * Handle the response.
       */
      items.$promise.then(function (data) {
        QueryManager.setOffset(data.offset);
        processResult(data);
      });
    };


    function processResult(data) {

      console.log(data);

      console.log(QueryManager.isAuthorListRequest())

      if (QueryManager.isAuthorListRequest()) {

        displayListType = QueryFields.AUTHOR;

        /**
         * Add the author array to shared context.
         * @type {string|Array|*}
         */
        QueryManager.setAuthorsList(data.facets);

        data.count = QueryManager.getAuthorsCount();

        /**
         * Todo: this count function works for data sets
         * less than the result set size. Need more deal with
         * the final page of a paging request.
         */
        var end = Utils.getPageListCount(data.count, setSize);

        /** Add authors to the current result set. */
        data.results = Utils.authorArraySlice(start, start + end);
        console.log(data);


      }

      else if (QueryManager.isSubjectListRequest()) {

        displayListType = QueryFields.SUBJECT;
        /**
         * Add the author array to shared context.
         * @type {string|Array|*}
         */
        QueryManager.setSubjectList(data.facets);

        data.count = QueryManager.getSubjectsCount();

        /**
         * Todo: this count function works for data sets less than the result set size. Need more deal with the final page of a paging request.
         */
        var end = Utils.getPageListCount(data.count, setSize);

        /** Add authors to the current result set. */
        data.results = Utils.subjectArraySlice(start, start + end);

      }

      else {

        displayListType = QueryFields.TITLE;

      }

      QueryManager.setCount(data.count);

      /**
       * Update parent component.
       */
      ctrl.onUpdate({
        results: data.results,
        count: data.count,
        position: QueryManager.getOffset(),
        field: displayListType
      });


    }


  }

  dspaceComponents.component('sortOptionsComponent', {

    bindings: {
      // callback function
      onUpdate: '&'
    },
    templateUrl: '/shared/templates/sortOptions.html',
    controller: SortOptionsCtrl

  });

})
();
