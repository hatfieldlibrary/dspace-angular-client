/**
 * Created by mspalti on 2/23/16.
 */

(function () {

  function PagerCtrl(SolrQuery,
                     SolrBrowseQuery,
                     Utils,
                     QueryManager,
                     QueryActions) {


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

      updateList(start);

    }

    init();

    /**
     * Execute node REST API call for solr query results.
     * @param start the start position for query result.
     */
    function updateList(start) {

      Utils.prepQueryContext(ctrl);

      QueryManager.setCurrentOffset(start);

      /**
       * When not paging through an author list,
       * we need to exec a new solr query.
       */
      if (!QueryManager.isAuthorListRequest()) {

        var context = QueryManager.getContext().query;
        var items;
        if (ctrl.action === QueryActions.LIST) {

          items = SolrQuery.save({
            params: context,
            offset: start

          });

        } else if (ctrl.action === QueryActions.BROWSE) {

          items = SolrBrowseQuery.query({
            type: context.asset.type,
            id: context.asset.id,
            field: context.query.field,
            terms: context.query.terms,
            offset: start

          });

        } else if (ctrl.action === QueryActions.SEARCH) {

          items = SolrQuery.save({
            params: context,
            offset: start

          });

        }
        // Handle result of the solr query.
        items.$promise.then(function (data) {
          console.log(data);
          updateParent(data);

        });
      }
      /**
       * The author list solr query returns list of all authors
       * in the collection.  To page through results, just use a
       * slice from the array stored on the query context.
       */
      else {

        data = [];
        data.results = Utils.authorArraySlice(start, start + setSize);
        data.count = QueryManager.getAuthorsCount();
        updateParent(data);

      }
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


  dspaceComponents.component('pagerComponent', {

    template: '<div ng-click="$ctrl.previous()"><< </div> {{$ctrl.start}} - {{$ctrl.end}} <div ng-click="$ctrl.next()"> >></div>',

    bindings: {
      onUpdate: '&',
      action: '@',
      type: '@',
      id: '@',
      field: '@',
      terms: '@'

    },
    controller: PagerCtrl

  });

})();
