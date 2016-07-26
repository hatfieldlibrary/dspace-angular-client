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

    ctrl.items = [];

    ctrl.offset = 0;

    ctrl.jump = false;

    ctrl.showOptions = ctrl.context !== 'advanced' && ctrl.context !== 'discover';

    ctrl.showDiscoverContainer = false;

    ctrl.resultMessage = '';

    function _format(str, arr) {
      return str.replace(/{(\d+)}/g, function (match, number) {
        return typeof arr[number] !== 'undefined' ? arr[number] : match;
      });
    }

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

    /**
     * This value is used to increment the offset for the message
     * that displays in view.
     * @type {number}
     */
    var endIncrement = AppContext.getSetSize() - 1;

    ctrl.isBrowseContext = function () {
      return ctrl.context === 'browse';

    };


    /**
     * Adds new results to current items.
     * @param results  items returned by paging query.
     */
    function addResults(results) {
      if (typeof ctrl.items !== 'undefined') {
        ctrl.items = ctrl.items.concat(results);
      }

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
      AppContext.setSelectedPositionIndex(index);

    };


    /**
     * Non-pager updates.
     * @param results  items in result
     * @param count  total number of items
     * @param field   the field queried
     */
    ctrl.onUpdate = function (results, count, field, offset, jump) {

      ctrl.jump = jump;
      ctrl.ready = true;
      ctrl.items = results;
      ctrl.field = field;
      ctrl.count = count;
      offset++;
      var end = '';
      if (count < endIncrement) {
        end = count;
      } else {
        end = offset + endIncrement;
        if (end > count) {
          end = count;
        }
      }
      var start = AppContext.getStartIndex() + 1;
      if (count > 0) {
        ctrl.resultMessage = _format(Messages.RESULTS_LABEL, [start, end, count]);
      } else {
        ctrl.resultMessage = Messages.NO_RESULTS_LABEL;
      }
      ctrl.showDiscoverContainer = ctrl.context === 'discover' || ( ctrl.context !== 'advanced');

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
      ctrl.field = field;
      ctrl.count = count;
      var off = parseInt(AppContext.getNextPagerOffset(), 10);
      off++;
      var end = off + endIncrement;
      if (end > count) {
        end = count;
      }
      var start = AppContext.getStartIndex() + 1;
      ctrl.resultMessage = _format(Messages.RESULTS_LABEL, [start, end, count]);


    };

    ctrl.onPreviousUpdate = function (results, count, field) {

      ctrl.ready = true;
      addPreviousResults(results);
      ctrl.field = field;
      ctrl.count = count;
      var end = parseInt(AppContext.getNextPagerOffset(), 10) + endIncrement + 1;
      var start = AppContext.getStartIndex() + 1;
      ctrl.resultMessage = _format(Messages.RESULTS_LABEL, [start, end, count]);


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
        ctrl.currentOffset = qs.offset;
        ctrl.showPager = qs.offset > 0;
      } else {
        ctrl.showPager = QueryManager.getOffset() > 1;
      }

      if (QueryManager.getAction === QueryActions.SEARCH) {
        ctrl.showOptions = false;
      }

      if (typeof qs.filter !== 'undefined') {
        if (qs.filter === 'none') {
          ctrl.jump = false;
        } else {
          ctrl.jump = true;
        }
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


