/**
 * Created by mspalti on 2/23/16.
 */

(function () {

  function PagerCtrl($scope,
                     SolrQuery,
                     SolrBrowseQuery,
                     Utils,
                     QueryManager,
                     QueryActions,
                     QueryTypes,
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

    var displayListType = '';

    /**
     * Initialize the context.
     */
    function init() {

      QueryManager.setOffset(0);

      var action = QueryManager.getAction();

      if (action === QueryActions.LIST) {
        // If pager is attached to item list, initialize
        // to title.
        QueryManager.setQueryType(QueryTypes.TITLES_LIST);
        // setting this for now. Most all queries should accept
        // a sort parameter, so this will be parameterized in the
        // future.
        QueryManager.setSort(QuerySort.ASCENDING);

      } else if (action === QueryActions.BROWSE) {
        QueryManager.setQueryType(QueryActions.BROWSE);
        QueryManager.setSort(QuerySort.ASCENDING);

      } else if (action === QueryActions.SEARCH) {

        QueryManager.setQueryType(QueryTypes.DISCOVER);
        QueryManager.setSort(QuerySort.ASCENDING);
      }

      updateList(0);

    }

    init();

    $scope.$on("discoverySubmit", function() {
         updateList(0);
    });

    /**
     * Execute node REST API call for solr query results.
     * @param start the start position for query result.
     */
    function updateList(start) {

      QueryManager.setOffset(start);

      var action = QueryManager.getAction();

      displayListType = Utils.getDisplayListType(action);

      /**
       * When not paging through an author list,
       * we need to exec a new solr query.
       */
      if (!QueryManager.isAuthorListRequest() && !QueryManager.isSubjectListRequest()) {

        var context = QueryManager.getContext().query;

        var items;

        if (action === QueryActions.LIST) {
          items = SolrQuery.save({
            params: context,
            offset: start

          });

        } else if (action === QueryActions.BROWSE) {

          items = SolrBrowseQuery.query({
            site: QueryManager.getAssetType(),
            id: QueryManager.getAssetId(),
            field: context.query.field,
            terms: context.query.terms,
            offset: start

          });

        } else if (action === QueryActions.SEARCH) {

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

        if (QueryManager.isAuthorListRequest()) {

          data.count = QueryManager.getAuthorsCount();
          var end = Utils.getPageListCount(data.count, setSize);
          data.results = Utils.authorArraySlice(start, start + end);

        } else if (QueryManager.isSubjectListRequest()) {

          data.count = QueryManager.getSubjectsCount();
          var end = Utils.getPageListCount(data.count, setSize);
          data.results = Utils.subjectArraySlice(start, start + end);

        }

        updateParent(data);

      }
    }

    /**
     * Update the parent component with new items.
     * @param data the next set if items.
     */
    function updateParent(data) {


      var nType = Utils.getNormalizedType(QueryManager.getAssetType());
      var type = Utils.getType(nType);
      var id = Utils.getId(data, nType);

      ctrl.onUpdate({

        results: data.results,
        count: data.count,
        type: type,
        id: id,
        field: displayListType

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
      onUpdate: '&'

    },
    controller: PagerCtrl

  });

})();
