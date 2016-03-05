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
  function SortOptionsCtrl(SolrQuery, Utils, QueryManager, QueryFields) {

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
    // Move to angular.constant
    ctrl.fields = [
      {label: 'Title', value: 'dc.title_sort'},
      {label: 'Author', value: 'bi_2_dis_filter'},
      {label: 'Date', value: 'dc.date.accessioned_dt'}
    ];
    /**
     * The select model. Initialize to title.
     * @type {string}
     */
    ctrl.selectedField = 'dc.title_sort';

    /**
     * Update the view model.
     */
    ctrl.setField = function () {


      /**
       * Update query model with the new values.
       */
      QueryManager.setSort(ctrl.selectedField, 'asc');

      /**
       * Set browseFormat parameters.
       * MOVE TO UTILITY.
       */
      if (ctrl.selectedField === 'bi_2_dis_filter') {

        QueryManager.setSearchField(QueryFields.AUTHOR)

      } else if (ctrl.selectedField === 'dc.title_sort') {

        // In not browsing by author, itemType is sufficient here.    NOT
        QueryManager.setSearchField(QueryFields.TITLE);

      } else if (ctrl.selectedField === 'dc.date.accessioned_dt') {

        QueryManager.setSearchField(QueryFields.DATE);

      }

      var items = SolrQuery.save({
        params: QueryManager.context.query,
        offset: start
      });
      items.$promise.then(function (data) {

        if (QueryManager.isAuthorListRequest()) {

          /**
           * Add the author array to shared context.
           * @type {string|Array|*}
           */
          QueryManager.setAuthorsList(data.authors);

          /** Add authors to the current result set. */
          data.results = Utils.authorArraySlice(start, start + setSize);

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
