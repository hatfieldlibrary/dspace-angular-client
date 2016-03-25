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
  function SortOptionsCtrl(SolrQuery,
                           ListQueryFieldMap,
                           ListSortOrderMap,
                           Utils,
                           QuerySort,
                           QueryFields,
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

    ctrl.resetOrder = function() {

      QueryManager.setSort(ctrl.selectedOrder);

      ctrl.doSearch();

    };

    ctrl.resetField = function setField() {
      /**
       * Set the QueryType (identifies the solr query to be used).
       */
      QueryManager.setQueryType(ctrl.selectedField);
      ctrl.doSearch();
    };

    /**
     * Update the view model after user selects new browse by field option.
     */
    ctrl.doSearch = function () {

      /**
       * Return offset to zero in case user has paged through
       * a previous result list.
       */
      QueryManager.setOffset(0);

      /**
       * Do the query.
       * @type {Session|*|{method}}
         */
      var items = SolrQuery.save({

        params: QueryManager.context.query,
        offset: start

      });
      /**
       * Handle the response.
       */
      items.$promise.then(function (data) {

        console.log(data)

        console.log(QueryManager.isAuthorListRequest())

        if (QueryManager.isAuthorListRequest()) {

          displayListType = QueryFields.AUTHOR;

          /**
           * Add the author array to shared context.
           * @type {string|Array|*}
           */
          QueryManager.setAuthorsList(data.authors);

          data.count = QueryManager.getAuthorsCount();

          /**
           * Todo: this count function works for data sets
           * less than the result set size. Need more deal with
           * the final page of a paging request.
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
          QueryManager.setSubjectList(data.authors);

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

        /**
         * Update parent component.
         */
        ctrl.onUpdate({
          results: data.results,
          count: data.count,
          field: displayListType
        });


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

})();
