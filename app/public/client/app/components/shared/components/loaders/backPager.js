/**
 * Component for paging backward through result set.
 * Created by mspalti on 4/10/16.
 */


'use strict';

(function () {

  function PagerCtrl($scope,
                     $location,
                     QueryManager,
                     AppContext,
                     PagerUtils) {


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
      console.log(offset)
      console.log(AppContext.isFilter())
      return offset !== 0 && !AppContext.isFilter();
    }

    /**
     * Watch for changes to query offset triggered by a
     * query string update.   Probably UNNECESSARY.
     */
    $scope.$watch(function () {
      console.log('in back pager, start index ' + AppContext.getStartIndex())
        return QueryManager.getOffset();
      },
      function (newValue) {
        AppContext.setStartIndex(newValue);
        backPager.more = more(newValue);

      });

    /**
     * Count must be initialized to 0.
     * @type {number}
     */
    var count = 0;

    /**
     * Updates the values for start and end  positions.
     * These are used in the view to provide the user with
     * position information.
     * @param offset
     * @private
     */
    function _setOffset(offset) {

      pager.start = offset + 1;

      if (pager.end + setSize <= count) {
        pager.end += setSize;
      } else {
        pager.end = count;
      }
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

      //var offset = parseInt(AppContext.getPrevousPagerOffset(), 10);
      var offset = QueryManager.getOffset();
      console.log('previous offset ' + offset)
      console.log('set size')

      if (offset == setSize) {
        offset -= setSize;
      }
      _setOffset(offset );
      return PagerUtils.prevUrl(offset);

    };

    function init() {

      var offset = QueryManager.getOffset();
      AppContext.setStartIndex(offset);
      console.log('init')

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
      var offset = AppContext.getPrevousPagerOffset();

      console.log(offset);
      backPager.more = more(offset);
      console.log(backPager.more = more(offset))

      if (offset < setSize) {
        offset = 0;
        AppContext.setStartIndex(0);
      }


      console.log('PREV ' + offset)

      console.log(PagerUtils.prevUrl(offset))
      backPager.url = PagerUtils.prevUrl(offset);



    }

    init();


    /**
     * Method for retrieving the previous result set.
     */
    backPager.previous = function () {



  //    backPager.url = PagerUtils.prevUrl(AppContext.getPrevousPagerOffset() - AppContext.getSetSize());

   //    /**
   //     * Set the start value to the current lowest start index.
   //     */
   //    var offset = AppContext.getPrevousPagerOffset();
   //
   //    if (offset < setSize) {
   //      offset = 0;
   //      AppContext.setStartIndex(0);
   //    }
   //    else if (offset >= setSize) {
   //      AppContext.setStartIndex(offset);
   //    }
   //
   //
   //    console.log('PREV '+offset)
   //    console.log(PagerUtils.prevUrl(offset))
   //    backPager.url = PagerUtils.prevUrl(offset);
   //
   //    // AppContext.setPreviousPagerOffset(offset - setSize);
   //
   //    AppContext.setOpenItem(-1);
   //    AppContext.setSelectedPositionIndex(-1);
   //
   // //   backPager.more = more(offset);
   //
   //    AppContext.isNewSet(false);
      // var qs = $location.search();
      // qs.field = QueryManager.getQueryType();
      // qs.sort = QueryManager.getSort();
      // qs.terms = '';
      // qs.offset = offset;
      // qs.d = 'prev';
      // delete qs.id;
      // delete qs.pos;
      // delete qs.itype;
      // $location.search(qs);




    };

  }


  dspaceComponents.component('pagerBackComponent', {

    template: '<div layout="row" layout-align="center center" ><a ng-click="backPager.previous()" href="{{backPager.prevUrl()}}"><md-button class="md-raised md-accent md-fab md-mini" ng-if="backPager.more"><md-icon md-font-library="material-icons" class="md-light" aria-label="Previous Results">expand_less</md-icon></md-button></a></div>',

    bindings: {
      context: '@'

    },
    controller: PagerCtrl,
    controllerAs: 'backPager'

  });

})();
