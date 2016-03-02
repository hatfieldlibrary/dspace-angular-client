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
  function SortOptionsCtrl(SolrQueryByType, Utils, Data) {

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
     * Update the view model.  Called by ng-change directive.
     */
    ctrl.setField = function () {

      Data.query.sort.field = ctrl.selectedField;
      Data.query.sort.order = "asc";

      /**
       * Set returnAuthors and resultFormat query parameters.
       */
      if (ctrl.selectedField === 'bi_2_dis_filter') {
        Data.query.returnAuthors = true;
        Data.query.resultFormat = Utils.authorType;

      } else {
        Data.query.resultFormat = Utils.itemType;
      }

      var items = SolrQueryByType.save({
        params: Data.query,
        offset: start
      });
      items.$promise.then(function (data) {
        if (Data.query.returnAuthors) {
          /**
           * Add the author array to shared context.
           * @type {string|Array|*}
           */
          Data.authorList = data.authors;
          /** Add authors to result. */
          data.results = Utils.authorArraySlice(data.results, start, end);

        }
        /**
         * Update parent component.
         */
        ctrl.onUpdate({results: data.results, count: data.count, resultFormat: Data.query.resultFormat});
        /**
         * Reset returnAuthors boolean to default value.
         */
        Data.query.returnAuthors = false;

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
