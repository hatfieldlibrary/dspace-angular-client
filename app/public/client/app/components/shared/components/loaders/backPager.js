/**
 * Component for paging backward through result set.
 * Created by mspalti on 4/10/16.
 */


'use strict';

(function () {

  function PagerCtrl($scope,
                     QueryManager,
                     AppContext,
                     PagerUtils) {


    var backPager = this;

    backPager.showPager = true;

    backPager.more = false;

    /**
     * Checks for additional previous items.
     * @param offset
     * @returns {boolean}
     */
    function more(offset) {
      return offset >= 0 && !AppContext.isFilter();
    }

    /**
     * Watch for changes to query offset triggered by a
     * query string update.   Probably UNNECESSARY.
     */
    $scope.$watch(function () {
        return AppContext.getPrevousPagerOffset();
      },
      function (newValue) {

        backPager.more = more(newValue);

      });

    /**
     * Generates and returns the url for the pager link. Also,
     * the PagerUtils method will update the link rel="next" and rel="prev"
     * html header elements to assist search engines, per google recommendation
     * for infinite scroll (The full recommendation is not followed since
     * this component provides a click-able link for the crawler to follow. Only
     * the header links are implemented.)
     *
     * @returns {string}
     */
    backPager.prevUrl = function () {

      var offset = AppContext.getPrevousPagerOffset();
      return PagerUtils.prevUrl(offset);

    };

    function init() {

     // var offset = QueryManager.getOffset();
    //  AppContext.setStartIndex(offset);

      /**
       * Current start position for view model.
       * @type {number}
       */
      backPager.start = QueryManager.getOffset() + 1;
      /**
       * Current end position for view model.
       * @type {number}
       */
      backPager.end = AppContext.getNextPagerOffset();
      /**
       * Used in ng-if to show/hide the component.
       * @type {boolean}
       */
      backPager.showPager = AppContext.getPager();

      /**
       * Show/hide the pager based on the query offset.
       */
      var offset = AppContext.getPrevousPagerOffset();

      backPager.more = more(offset);

      backPager.url = PagerUtils.prevUrl(offset);


    }

    init();


  }


  dspaceComponents.component('pagerBackComponent', {

    template: '<div layout="row" layout-align="center center" ><a rel="nofollow" ng-href="{{backPager.prevUrl()}}"><md-button class="md-raised md-accent md-fab md-mini" ng-if="backPager.more"><md-icon md-font-library="material-icons" class="md-light" aria-label="Previous Results">expand_less</md-icon></md-button></a></div>',

    bindings: {
      context: '@'

    },
    controller: PagerCtrl,
    controllerAs: 'backPager'

  });

})();
