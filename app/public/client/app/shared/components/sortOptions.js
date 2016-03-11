/**
 * Created by mspalti on 2/29/16.
 */

'use strict';

(function () {

  /**
   * Controller for the sort options component included in
   * the parent itemList component.
   *
   * @param SolrQueryByType  server for the node REST API endpoint
   * @param Utils  utilities
   * @param QueryManager  share context object
   * @constructor
   */
  function SortOptionsCtrl(SolrQuery,
                           SolrConstants,
                           Utils,
                           QuerySort,
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
     * The select fields view model.
     * @type {*[]}
     */
    ctrl.fields = SolrConstants.fields;

    /**
     * The select model. Initialize to title.
     * @type {string}
     */
    ctrl.selectedField = SolrConstants.fields[0].label;


    /**
     * Update the view model after user selects new browse by field option.
     */
    ctrl.setField = function () {

      console.log(ctrl.selectedField);

      /**
       * Update query model with the new values.
       */
      QueryManager.setSort(ctrl.selectedField, QuerySort.ASCENDING);

      /**
       * Sets the query field and query type.
       */
      Utils.setListFormat(ctrl.selectedField);

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

        if (QueryManager.isAuthorListRequest()) {

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

        if (QueryManager.isSubjectListRequest()) {
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

          console.log(Utils.subjectArraySlice(start, start + end));

          /** Add authors to the current result set. */
          data.results = Utils.subjectArraySlice(start, start + end);

        }

        /**
         * Update parent component.
         */
        ctrl.onUpdate({results: data.results, count: data.count, field: QueryManager.getSearchField()});


      });
    }


  }

  dspaceComponents.component('sortOptionsComponent', {

    bindings: {
      onUpdate: '&'
    },
    templateUrl: '/shared/templates/sortOptions.html',
    controller: SortOptionsCtrl

  });

})();
