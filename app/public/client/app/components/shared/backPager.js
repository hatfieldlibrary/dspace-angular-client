/**
 * Component for paging backward through result set.
 * Created by mspalti on 4/10/16.
 */


'use strict';

(function () {

  function PagerCtrl(
                     LoaderUtils,
                     QueryManager,
                     AppContext) {


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

      return LoaderUtils.prevUrl(backPager.prev);

    };

    backPager.$onChanges = function(changes) {

      if (changes.prev) {
        backPager.prev = changes.prev.currentValue;
        // Show/hide the offset value for previous items.
        backPager.more = more(backPager.prev);

      }
    };

    backPager.$onInit = function() {

      /**
       * Current start position for view model.
       * @type {number}
       */
      backPager.start = QueryManager.getOffset() + 1;
      /**
       * Used in ng-if to show/hide the component.
       * @type {boolean}
       */
      backPager.showPager = AppContext.getPager();

      backPager.url = LoaderUtils.prevUrl(backPager.prev);


    };


  }


  dspaceComponents.component('pagerBackComponent', {

    template: '<div layout="row" layout-align="center center" ><a rel="nofollow" ng-href="{{backPager.prevUrl()}}"><md-button class="md-raised md-accent md-fab md-mini" ng-if="backPager.more"><md-icon md-font-library="material-icons" class="md-light" aria-label="Previous Results">expand_less</md-icon></md-button></a></div>',

    bindings: {
      prev: '@',
      end: '@',
      context: '@'

    },
    controller: PagerCtrl,
    controllerAs: 'backPager'

  });

})();
