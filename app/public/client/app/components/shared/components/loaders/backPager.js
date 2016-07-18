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
        backPager.showPager = +newValue !== 0;

      });


    function init() {

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

        var qs = $location.search();
        qs.field = QueryManager.getQueryType();
        qs.sort = QueryManager.getSort();
        qs.terms = '';
        qs.offset = start;
        delete qs.d;
        delete qs.id;
        delete qs.pos;
        $location.search(qs);
      } else {
        AppContext.setStartIndex(0);
      }


    };

  }


  dspaceComponents.component('pagerBackComponent', {

    template: '<div layout="row" layout-align="center center" ng-if="backPager.showPager"><a href="#" ng-click="backPager.previous()"><md-button class="md-raised md-accent md-fab md-mini" ng-if="backPager.more()"><md-icon md-font-library="material-icons" class="md-light" aria-label="Previous Results">expand_less</md-icon></md-button></a></div>',

    bindings: {
      onUpdate: '&'

    },
    controller: PagerCtrl,
    controllerAs: 'backPager'

  });

})();
