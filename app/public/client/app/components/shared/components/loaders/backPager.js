/**
 * Created by mspalti on 4/10/16.
 */


'use strict';

(function () {

  function PagerCtrl($scope,
                     $location,
                     Utils,
                     QueryManager,
                     AppContext,
                     QueryActions,
                     DiscoveryContext,
                     SolrDataLoader,
                     FacetHandler) {


    var backPager = this;

    /**
     * Number of items to return in pager.
     * @type {number}
     */
    var setSize = AppContext.getSetSize();


    function init() {
      var qs = $location.search();

      var offset = 0;
      if (Object.keys(qs).length > 0) {
        // convert to int.
        offset = parseInt(qs.offset, 10);
        QueryManager.setOffset(qs.offset);
        QueryManager.setSort(qs.sort);
        QueryManager.setQueryType(qs.field);
      } else {
        offset = QueryManager.getOffset();
      }
      /**
       * Get the offset for the next result set.
       * @returns {boolean}
       */
      backPager.more = function () {
        return AppContext.getCount() > offset - setSize;
      };
      /**
       * Current start position for view model.
       * @type {number}
       */
      // Use unary '+' operator to convert offset string to number.
      backPager.start = offset + 1;
      /**
       * Current end position for view model.
       * @type {number}
       */
      backPager.end = offset - setSize;
      /**
       * Used in ng-if to show/hide the component.
       * @type {boolean}
         */
      backPager.showPager = offset > 0;


    }

    init();


    /**
     * Update the parent component with new items.
     * @param data the next set if items.
     */
    function updateParent(data) {

      AppContext.setCount(data.count);

      backPager.showPager = backPager.start > 1;

      backPager.onUpdate({

        results: data.results,
        index: backPager.start,
        field: Utils.getFieldForQueryType()

      });

    }

    /**
     * This update function executes solr query.
     * @param start the start position for query result.
     */
    function updateList(newOffset) {

      if (AppContext.getDiscoveryContext() === DiscoveryContext.ADVANCED_SEARCH) {
        return;
      }

      QueryManager.setOffset(newOffset);


      /**
       * For items, we need to make a new solr query for the next
       * result set.
       *
       * Here, we check to be sure the current query is not for authors
       * or subjects.
       */
      if (AppContext.isNotFacetQueryType()) {

        var items = SolrDataLoader.invokeQuery();

        if (items !== undefined) {
          items.$promise.then(function (data) {

            updateParent(data);

          });
        }

      }
      /**
       * List author and subject.
       */
      else {

        QueryManager.setAction(QueryActions.LIST);

        /**
         * For authors or subjects, get next results from the facets
         * array rather than executing a new solr query.
         */
        if (AppContext.isAuthorListRequest()) {

          updateParent(FacetHandler.getAuthorList());


        } else if (AppContext.isSubjectListRequest()) {


          updateParent(FacetHandler.getSubjectList());
        }
      }

    }


    /**
     * View model method for retrieving the previous result set.
     */
    backPager.previous = function () {

      var start = QueryManager.getOffset();

      console.log(start);
      console.log(setSize);
      console.log(backPager.start)

      if (start >= setSize) {
        backPager.start -= setSize;
        backPager.end = backPager.start;
        console.log(backPager.start);
        QueryManager.setOffset(backPager.start);
        updateList(backPager.start);
      }

      $location.search({'field': QueryManager.getQueryType(), 'sort': QueryManager.getSort(), 'terms': '', 'offset': backPager.start});

    };


    $scope.$on('nextPage', function () {
      updateList(QueryManager.getOffset());
    });

  }


  dspaceComponents.component('pagerBackComponent', {

    template: '<div layout="row" layout-align="center center" ng-if="backPager.showPager"><md-button class="md-raised md-accent md-fab md-mini" ng-click="backPager.previous()" ng-if="backPager.more()"><md-icon md-font-library="material-icons" class="md-light" aria-label="Previous Results">expand_less</md-icon></md-button></div>',

    bindings: {
      onUpdate: '&'

    },
    controller: PagerCtrl,
    controllerAs: 'backPager'

  });

})();
