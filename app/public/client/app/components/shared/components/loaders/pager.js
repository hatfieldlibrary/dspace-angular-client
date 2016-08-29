/**
 * The controller for the pager component. Sets paging URLs and
 * maintains offset values.  Methods for updating the item lists are
 * defined in the parent component (item-list-component) and bound
 * during pager component initialization.
 *
 * This controller responds to location changes and page initialization
 * by invoking services that return data via solr queries.
 *
 * Created by mspalti on 2/23/16.
 */

'use strict';

(function () {

  /**
   * Pager controller.
   * @param $location
   * @param $scope
   * @param Utils
   * @param QueryManager
   * @param AppContext
   * @param OnPagerInit
   * @param OnPagerLocationChange
   * @param PagerUtils
   * @constructor
   */
  function PagerCtrl($location,
                     $scope,
                     Utils,
                     QueryManager,
                     AppContext,
                     OnPagerInit,
                     OnPagerLocationChange,
                     PagerUtils) {


    var pager = this;

    /**
     * Number of items to return in pager.
     * @type {number}
     */
    var setSize = AppContext.getSetSize();

    /**
     * Count must be initialized to 0.
     * @type {number}
     */
    var count = 0;

    /**
     * Check to see if more search results are available. Pager template
     * will show/hide the pager button based on return value.
     * @returns {boolean}
     */
     pager.moreItems = function () {
       return AppContext.getItemsCount() > QueryManager.getOffset() + setSize;
     };

    /**
     * Current start position for view.
     * @type {number}
     */
    pager.start = QueryManager.getOffset() + 1;

    /**
     * Current end position for view.
     * @type {number}
     */
    pager.end = QueryManager.getOffset() + setSize;


    /**
     * Updates the parent component with additional items.
     * @param data the next set of items.
     */
    this.updateParent = function (data, direction) {


      // Leave jump value undefined in pager updates.
      if (direction === 'prev') {
        pager.onPrevUpdate({
          results: data.results,
          count: data.count,
          field: Utils.getFieldForQueryType()
        });

      } else {
        pager.onPagerUpdate({
          results: data.results,
          count: data.count,
          field: Utils.getFieldForQueryType()
        });

      }
      /** Return new set to true */
      AppContext.isNewSet(true);

    };


    /**
     * Replaces the result list in the parent component
     * with new results.
     * @param data the next set if items.
     */
    this.updateParentNewSet = function (data) {
      /**
       * For new sets, always update the start index.
       */
      AppContext.setStartIndex(QueryManager.getOffset());

      if (data) {

        AppContext.setItemsCount(data.count);

        pager.onNewSet({
          results: data.results,
          count: data.count,
          field: Utils.getFieldForQueryType(),
          offset: QueryManager.getOffset(),
          jump: true
        });
      }

    };


    /**
     * Listen for location changes due to paging requests and
     * filter updates.
     */
    $scope.$on('$locationChangeSuccess', function () {

      AppContext.isFilter(false);
      var qs = $location.search();
      OnPagerLocationChange.onLocationChange(pager, qs, pager.context);

    });


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
     * Generates and returns the url for the pager link. Also
     * uses the SetNextLinkInHeader service to update the
     * link rel="next" html header element for SEO.
     *
     * @returns {string}
     */
    pager.nextUrl = function () {

      var offset = parseInt(AppContext.getNextPagerOffset(), 10);
      offset += setSize;

      _setOffset(offset);
      return PagerUtils.nextUrl(offset);

    };

    /**
     * Initialize the result set.
     */
    function _init() {

      AppContext.isFilter(false);
      var qs = $location.search();
      OnPagerInit.onInit(pager, qs);

    }

    _init();

  }


  dspaceComponents.component('pagerComponent', {

    templateUrl: '/ds/shared/templates/loaders/pager.html',
    bindings: {
      onPagerUpdate: '&',
      onPrevUpdate: '&',
      onNewSet: '&',
      context: '@'
    },
    controller: PagerCtrl,
    controllerAs: 'pager'

  });

})();
