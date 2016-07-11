/**
 * Component for paging backward through result set.
 * Created by mspalti on 4/10/16.
 */


'use strict';

(function () {

  function PagerCtrl($scope,
                     $location,
                     QueryManager,
                     AppContext) {


    var backPager = this;

    /**
     * Number of items to return in pager.
     * @type {number}
     */
    var setSize = AppContext.getSetSize();

    var offset = 0;

    backPager.showPager = false;

    /**
     * Watch for changes to query offset triggered by a
     * query string update.
     */
    $scope.$watch(function () {
        return AppContext.getStartIndex();
      },
      function (newValue) {
        // unary operator
        backPager.showPager = newValue !== +0;

      });


    function init() {

      var qs = $location.search();

      console.log('init');


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
     * Method for retrieving the previous result set.
     */
    backPager.previous = function () {

      /**
       * Set the start value to the current lowest start index.
       */
      var start = AppContext.getStartIndex();


      if (start >= setSize) {
        start -= setSize;
        // QueryManager.setOffset(start + 1);
        // Set the lowest start index to the new, decremented value.
        AppContext.setStartIndex(start);
        $location.search({
          'field': QueryManager.getQueryType(),
          'sort': QueryManager.getSort(),
          'terms': '',
          'offset': start,
          'd': 'prev'
        });
      } else {
        AppContext.setStartIndex(0);
      }


    };

    // $scope.$on('nextPage', function () {
    //   updateList(QueryManager.getOffset());
    // });

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
