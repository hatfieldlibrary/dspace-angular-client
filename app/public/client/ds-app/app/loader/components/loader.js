/**
 * Created by mspalti on 9/19/16.
 */

(function () {

  'use strict';

  /**
   * Back paging controller.
   * @param $location
   * @param $scope
   * @param Utils
   * @param QueryManager
   * @param AppContext
   * @param OnPagerInit
   * @param OnPagerLocationChange
   * @constructor
   */
  function LoaderCtrl($location,
                     $scope,
                     Utils,
                     QueryManager,
                     AppContext,
                     OnPagerInit,
                     OnPagerLocationChange) {


    var loader = this;

    /**
     * Check to see if more search results are available. Pager template
     * will show/hide the pager button based on return value.
     * @returns {boolean}
     */
    loader.moreItems = function () {
      return AppContext.getItemsCount() > AppContext.getNextPagerOffset();
    };

    /**
     * Current start position for view.
     * @type {number}
     */
    loader.start = QueryManager.getOffset() + 1;

    /**
     * Listen for location changes due to paging requests and
     * filter updates.
     */
    $scope.$on('$locationChangeSuccess', function () {

      var qs = $location.search();

      // only act on location changes for paging requests
      var re = /^\/ds\/handle|^\/ds\/discover|^\/ds\/advanced|^\/ds\/browse/;

      var path = $location.path();
      if (path.match(re)) {
        OnPagerLocationChange.onLocationChange(loader, qs, loader.context);
      }

    });

    /**
     * Initialize the component.
     */
    loader.$onInit = function () {

      AppContext.isFilter(false);
      var qs = $location.search();
      OnPagerInit.onInit(loader, qs);

    };

    // The following functions are wrappers for bound callbacks
    // provided by the parent component. Callback parameters are key/value
    // pairs. The wrapper allows services to return data without knowing that
    // the function is a callback. We create the object literals here.

    /**
     * Updates the parent component with additional items.
     * @param data the next set of items.
     */
    this.updateParent = function (data, direction) {


      // Leave jump value undefined in pager updates.
      if (direction === 'prev') {

        loader.onPrevUpdate({
          results: data.results,
          count: data.count,
          field: Utils.getFieldForQueryType()
        });

      } else {

        loader.onPagerUpdate({
          results: data.results,
          count: data.count,
          field: Utils.getFieldForQueryType()
        });

      }
      // Return new set to true
      AppContext.isNewSet(true);

    };

    /**
     * Replaces the result list in the parent component
     * with new results.
     * @param data the next set if items.
     */
    this.updateParentNewSet = function (data) {
      if (data) {
        loader.onNewSet({
          results: data.results,
          count: data.count,
          field: Utils.getFieldForQueryType(),
          offset: QueryManager.getOffset(),
          jump: true
        });
      }

    };

    /**
     * Sets the id of the selected item on the parent component.
     * @param id
     */
    this.setTheSelectedItem = function(id){
      loader.setSelectedItem({id: id});
    };
    /**
     * Sets the index position of the selected item in the parent component.
     * @param pos
     */
    this.setSelectedPosition = function(pos) {
       loader.setSelectedPos({pos: pos});
    };

    /**
     * Sets the offset of the previous pager offset on the parent component.
     * @param offset
     */
    this.setPrevPagerOffset = function(offset) {
         loader.prevPagerOffset({offset: offset});
    };
    /**
     * Sets the offset of the next pager offset on the parent component.
     * @param offset
     */
    this.setNextPagerOffset = function(offset) {
      loader.nextPagerOffset({offset: offset});
    };
    /**
     * Sets the current query type in the parent component. (Used to update sort options sibling.)
     * @param type
     */
    this.setTheQueryType = function(type) {
       loader.setQueryType({type: type});
    };
    /**
     * Sets the current sort order in the parent component. (Used to update sort options sibling.)
     * @param order
     */
    this.setTheSortOrder = function(order) {
      loader.setSortOrder({order: order});
    };

  }


  dspaceComponents.component('loaderComponent', {

    bindings: {
      context: '@',
      onNewSet: '&',
      onPagerUpdate: '&',
      onPrevUpdate: '&',
      setSelectedItem: '&',
      setSelectedPos: '&',
      nextPagerOffset: '&',
      prevPagerOffset: '&',
      setQueryType: '&',
      setSortOrder: '&'
    },
    controller: LoaderCtrl,
    controllerAs: 'loader'

  });

})();
