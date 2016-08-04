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

    backPager.showPager = true;

    backPager.more = false;

    /**
     * Checks for additional previous items.
     * @param offset
     * @returns {boolean}
     */
    function more(offset) {
      return offset !== 0 && !AppContext.isFilter();
    }

    /**
     * Watch for changes to query offset triggered by a
     * query string update.   Probably UNNECESSARY.
     */
    $scope.$watch(function () {
        return AppContext.getStartIndex();
      },
      function (newValue) {
        backPager.more = more(newValue);

      });

    function init() {

      var offset = QueryManager.getOffset();

      /**
       * Current start position for view model.
       * @type {number}
       */
      backPager.start = offset + 1;
      /**
       * Current end position for view model.
       * @type {number}
       */
      backPager.end = QueryManager.getOffset() !== 0;
      /**
       * Used in ng-if to show/hide the component.
       * @type {boolean}
       */
      backPager.showPager = AppContext.getPager();

      /**
       * Show/hide the pager based on the query offset.
       */
      backPager.more = more(offset);


    }

    init();


    /**
     * Method for retrieving the previous result set.
     */
    backPager.previous = function () {

      /**
       * Set the start value to the current lowest start index.
       */
      var offset = AppContext.getStartIndex();

      if (offset < setSize) {
        offset = 0;
        AppContext.setStartIndex(0);
      }
      else if (offset >= setSize) {
        offset -= setSize;
        AppContext.setStartIndex(offset);
      }

      AppContext.setPreviousPagerOffset(offset);

      AppContext.setOpenItem(-1);
      AppContext.setSelectedPositionIndex(-1);

      backPager.more = more(offset);
      // Set the lowest start index to the new, decremented value.
      AppContext.isNewSet(false);
      var qs = $location.search();
      qs.field = QueryManager.getQueryType();
      qs.sort = QueryManager.getSort();
      qs.terms = '';
      qs.offset = offset;
      qs.d = 'prev';
      delete qs.id;
      delete qs.pos;
      delete qs.itype;
      $location.search(qs);




    };

  }


  dspaceComponents.component('pagerBackComponent', {

    template: '<div layout="row" layout-align="center center" ><a href ng-click="backPager.previous()"><md-button class="md-raised md-accent md-fab md-mini" ng-if="backPager.more"><md-icon md-font-library="material-icons" class="md-light" aria-label="Previous Results">expand_less</md-icon></md-button></a></div>',

    bindings: {
      context: '@'

    },
    controller: PagerCtrl,
    controllerAs: 'backPager'

  });

})();
