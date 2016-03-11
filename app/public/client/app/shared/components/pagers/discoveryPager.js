/**
 * Created by mspalti on 3/2/16.
 */

function PagerCtrl(SolrQuery,
                   SolrBrowseQuery,
                   Utils,
                   QueryManager,
                   QueryActions,
                   QueryTypes,
                   QueryFields,
                   QuerySort) {


  var ctrl = this;

  /**
   * Intialize start index.
   * @type {number}
   */
  var start = 0;
  /**
   * Number of items to return in pager.
   * @type {number}
   */
  var setSize = 10;
  var count = 0;

  /**
   * Current start position for view model.
   * @type {number}
   */
  ctrl.start = start + 1;
  /**
   * Current end position for view model.
   * @type {number}
   */
  ctrl.end = start + 10;

  /**
   * Initialize the context.
   */
  function init() {

    QueryManager.clearQuery();

    QueryManager.setQueryType(QueryTypes.DISCOVER);

    updateList(0);

  }

  init();

  /**
   * Execute node REST API call for solr query results.
   * @param start the start position for query result.
   */
  function updateList(start) {

    Utils.prepQueryContext(ctrl);

    QueryManager.setOffset(start);


    var context = QueryManager.getContext().query;

    var items =
      items = SolrQuery.save({
        params: context,
        offset: start

      });

    // Handle result of the solr query.
    items.$promise.then(function (data) {
      console.log(data);
      updateParent(data);

    });

    updateParent(data);

  }


  /**
   * Update the parent component with new items.
   * @param data the next set if items.
   */
  function updateParent(data) {

    ctrl.onUpdate({
      results: data.results,
      count: data.count,
      field: QueryManager.getSearchField()
    });

  }

  /**
   * View model method for retrieving the previous result set.
   */
  ctrl.previous = function () {

    if (start >= 10) {
      ctrl.start -= 10;
      ctrl.end = ctrl.start + 9;
      start -= 10;
      updateList(start);
    }
  };

  /**
   * View model method for retrieveing the next result set.
   */
  ctrl.next = function () {

    start += 10;
    ctrl.start = start + 1;
    if (ctrl.end + 10 <= count) {
      ctrl.end += 10;
    } else {
      ctrl.end = count;
    }
    updateList(start);

  };

}


dspaceComponents.component('discoveryPagerComponent', {

  template: '<div ng-click="$ctrl.previous()"><< </div> {{$ctrl.start}} - {{$ctrl.end}} <div ng-click="$ctrl.next()"> >></div>',

  bindings: {
    onUpdate: '&',
    id: '@',
    terms: '@'

  },
  controller: PagerCtrl

});
