/**
 * Created by mspalti on 2/23/16.
 */

'use strict';

(function () {

  function ItemListCtrl($location,
                        QueryManager,
                        QueryActions,
                        AppContext,
                        Messages) {

    var ctrl = this;

    ctrl.ready = false;

    ctrl.showPager = false;

    ctrl.showOptions = ctrl.context !== 'advanced' && ctrl.context !== 'discover';

    ctrl.showDiscoverContainer = false;

    ctrl.resultCountLabel = Messages.RESULTS_LABEL;

    if (ctrl.context === 'browse') {
      ctrl.browseTerms = QueryManager.getSearchTerms();
    }

    /**
     * The selected index. This is used to set the css .select class
     * of items in the list.
     */
    ctrl.selectedIndex = -1;

    /**
     * The current asset type. Used to set the list type in the view.
     */
    ctrl.type = QueryManager.getAssetType();

    /**
     * The current DSpace asset Id. Required by author and subject lookups.
     */
    ctrl.id = QueryManager.getAssetId();

    ctrl.offset = QueryManager.getOffset();

    ctrl.isBrowseContext = function () {
      return ctrl.context === 'browse';

    };


    /**
     * Adds new results to current items.
     * @param results  items returned by paging query.
     */
    function addResults(results) {
      ctrl.items = ctrl.items.concat(results);

    }

    /**
     * Adds new results to current items at start of the array.
     * @param results  items returned by paging query.
     */
    function addPreviousResults(results) {
      ctrl.items = results.concat(ctrl.items);
    }

    /**
     * Sets the selected index in the controller and in the application
     * context.  Used by subject and author lists to toggle view state.
     * @param index
     */
    ctrl.setSelected = function (index) {
      ctrl.selectedIndex = index;
      AppContext.setCurrentIndex(index);

    };


    /**
     * Non-pager updates.
     * @param results  items in result
     * @param count  total number of items
     * @param field   the field queried
     */
    ctrl.onUpdate = function (results, count, field) {

      //  ctrl.showPager = false;
      ctrl.ready = true;
      ctrl.items = results;
      ctrl.count = count;
      ctrl.field = field;
      ctrl.showDiscoverContainer = ctrl.context === 'discover'
        || (ctrl.count > 10 && ctrl.context !== 'advanced')
        || (ctrl.count === 0 && ctrl.context !== 'advanced');

    };

    /**
     * Pager updates, including the initial page load.
     * @param results  new items to add to list.
     * @param count  total number of items.
     * @param field  the field queried.
     */
    ctrl.onPagerUpdate = function (results, count, field) {

      ctrl.ready = true;
      addResults(results);
      ctrl.count = count;
      ctrl.field = field;

    };

    ctrl.onPreviousUpdate = function (results, index) {

      if (index === 1) {
        ctrl.showPager = false;
      }
      addPreviousResults(results);

    };

    ctrl.resetListView = function () {
      ctrl.ready = false;
      ctrl.items = [];

    };


    function init() {

      /**
       * The array containing the items to present in the view.
       * @type {Array}
       */
      ctrl.items = [];

      var qs = $location.search();
      if (typeof qs.offset !== 'undefined') {
        ctrl.showPager = qs.offset > 0;
      } else {
        ctrl.showPager = QueryManager.getOffset() > 1;

      }

      if (QueryManager.getAction === QueryActions.SEARCH) {
        ctrl.showOptions = false;
      }

    }

    init();

  }


  dspaceComponents.component('itemListComponent', {

    bindings: {
      context: '@'
    },

    templateUrl: '/ds/shared/templates/lists/itemList.html',
    controller: ItemListCtrl

  });

})();


