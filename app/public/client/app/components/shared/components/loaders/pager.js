/**
 * Created by mspalti on 2/23/16.
 */

(function () {

  function PagerCtrl($scope,
                     SolrQuery,
                     SolrBrowseQuery,
                     Utils,
                     QueryManager,
                     QueryActions) {


    var ctrl = this;

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
    ctrl.start = QueryManager.getOffset() + 1;
    /**
     * Current end position for view model.
     * @type {number}
     */
    ctrl.end = QueryManager.getOffset() + 10;

    var displayListType = '';

    /**
     * Recieves broadcast from the discovery-search-box component.
     */
    $scope.$on("discoverySubmit", function() {
      QueryManager.setOffset(0);
      updateList(0);
    });

    $scope.$on("nextPage", function() {
      updateList(QueryManager.getOffset());
    });


    /**
     * Initialize data for the first set if items.
     */
    function init() {

      //QueryManager.setOffset(start);

      updateList(QueryManager.getOffset());

    }

    init();


    /**
     * Execute node REST API call for solr query results.
     * @param start the start position for query result.
     */
    function updateList(newOffset) {

      QueryManager.setOffset(newOffset);

      var action = QueryManager.getAction();

      displayListType = Utils.getFieldForQueryType();

      /**
       * When not paging through an author list,
       * we need to exec a new solr query.
       */
      if (!QueryManager.isAuthorListRequest() && !QueryManager.isSubjectListRequest()) {

        var context = QueryManager.getContext().query;

        var items;

        if (action === QueryActions.LIST) {
          items = SolrQuery.save({
            params: context

          });

        } else if (action === QueryActions.BROWSE) {

          items = SolrBrowseQuery.query({
            site: QueryManager.getAssetType(),
            id: QueryManager.getAssetId(),
            qType: QueryManager.getQueryType(),
            field: context.query.field,
            terms: context.query.terms,
            offset: newOffset

          });

        } else if (action === QueryActions.SEARCH) {

          items = SolrQuery.save({
            params: context

          });

        }
        // Handle result of the solr query.
        items.$promise.then(function (data) {
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
          data.results = Utils.authorArraySlice(QueryManager.getOffset(), QueryManager.getOffset() + end);

        } else if (QueryManager.isSubjectListRequest()) {

          data.count = QueryManager.getSubjectsCount();
          var end = Utils.getPageListCount(data.count, setSize);
          data.results = Utils.subjectArraySlice(QueryManager.getOffset(), QueryManager.getOffset() + end);

        }
        
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
        position: QueryManager.getOffset(),
        field: displayListType

      });

    }

    /**
     * View model method for retrieving the previous result set.
     */
    ctrl.previous = function () {

      var start =  QueryManager.getOffset();

      if (start >= 10) {
        ctrl.start -= 10;
        ctrl.end = ctrl.start + 9;
        start -= 10;
        QueryManager.setOffset(start);
        updateList(start);
      }
    };

    /**
     * View model method for retrieveing the next result set.
     */
    ctrl.next = function () {

      var start =  QueryManager.getOffset();

      start += 10;
      ctrl.start = start + 1;
      if (ctrl.end + 10 <= count) {
        ctrl.end += 10;
      } else {
        ctrl.end = count;
      }
      console.log(start)
      QueryManager.setOffset(start);
      updateList(start);

    };

  }


  dspaceComponents.component('pagerComponent', {

    template: '<div layout="row" layout-align="center center"><md-button class="md-raised" ng-click="$ctrl.next()">More Results</md-button></div>',

    bindings: {
      onUpdate: '&'

    },
    controller: PagerCtrl

  });

})();
