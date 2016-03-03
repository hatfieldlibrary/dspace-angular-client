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
   * @param Data  share context object
   * @constructor
   */
  function SortOptionsCtrl(SolrQuery, Utils, Data) {

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
    var end = 10;

    /**
     * The select fields view model.
     * @type {*[]}
     */
    ctrl.fields = [{label: 'Title', value: 'dc.title_sort'}, {
      label: 'Author',
      value: 'bi_2_dis_filter'
    }, {label: 'Date', value: 'dc.date.accessioned_dt'}];
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
      Data.setSort(ctrl.selectedField, 'asc');

      /**
       * Set returnAuthors and browseFormat parameters.
       */
      if (ctrl.selectedField === 'bi_2_dis_filter') {
        // Return a new author list.
        Data.shouldReturnAuthorsList(true);
        // Set the browse format to author
        Data.setBrowseFormat(Utils.authorType);

      } else {
        // In not browsing by author, itemType is sufficient here.
        Data.setBrowseFormat(Utils.itemType);
      }

      var items = SolrQuery.save({
        params: Data.context.query,
        offset: start
      });
      items.$promise.then(function (data) {


        if (Data.context.query.returnAuthorsList) {

          /**
           * Add the author array to shared context.
           * @type {string|Array|*}
           */
          Data.setAuthorsList(data.authors);

          /** Add authors to the current result set. */
          data.results = Utils.authorArraySlice(data.results, start, end);

          /**
           * Reset returnAuthors boolean to default value. This way
           * paging through authors will not return another, unneeded copy
           * of the author list.
           */
          Data.shouldReturnAuthorsList(false);

        }
        /**
         * Update parent component.
         */
        ctrl.onUpdate({results: data.results, count: data.count, browseFormat: Data.context.query.browseFormat});


      });
    }


  }

  dspaceComponents.component('sortOptionsComponent', {

    bindings: {
      onUpdate: '&'

    },
    templateUrl: '/common/templates/sortOptions.html',
    controller: SortOptionsCtrl

  });

})();
