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

    ctrl.showPager = false;

    ctrl.items = [];

    ctrl.jump = false;

    ctrl.showOptions = ctrl.context !== QueryActions.SEARCH;

    ctrl.showDiscoverContainer = false;

    ctrl.resultMessage = '';

    ctrl.nextPagerOffset = 0;

    ctrl.prevPagerOffset = 0;

    ctrl.qt = AppContext.getDefaultItemListField();

    ctrl.sort = AppContext.getDefaultSortOrder();

    function _format(str, arr) {
      return str.replace(/{(\d+)}/g, function (match, number) {
        return typeof arr[number] !== 'undefined' ? arr[number] : match;
      });
    }

    if (ctrl.context === QueryActions.BROWSE) {
      ctrl.browseTerms = QueryManager.getSearchTerms();
    }

    /**
     * The selected index. This is used to set the css .select class
     * of items in the list.
     */
    ctrl.selectedPosition = -1;
    /**
     * Holds the id of the currently selected item.
     * @type {number}
     */
    ctrl.selectedItem = -1;

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
      return ctrl.context === QueryActions.BROWSE;

    };

    ctrl.addBorder = function (index) {
      if (index === 0) {
        return false;
      }

      return (index + 1) % AppContext.getSetSize() === 0;
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
     * Updates the currently selected item id.
     * @param id
     */
    ctrl.setSelectedItem = function (id) {
      ctrl.selectedItem = id;

    };

    /**
     * Sets the selected index in the controller and in the application
     * context.  Used by subject and author lists to toggle view state.
     * @param index
     */
    ctrl.setSelectedPosition = function (pos) {

      ctrl.selectedPosition = pos;

    };

    ctrl.setNextPagerOffset = function (offset) {
      ctrl.nextPagerOffset = offset;
    };

    ctrl.setPrevPagerOffset = function (offset) {
      ctrl.prevPagerOffset = offset;
    };

    /**
     * Non-pager updates.
     * @param results  items in result
     * @param count  total number of items
     * @param field   the field queried
     */
    ctrl.onUpdate = function (results, count, field, offset, jump) {

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
      var start = AppContext.getViewStartIndex() + 1;
      if (count > 0) {
        ctrl.resultMessage = _format(Messages.RESULTS_LABEL, [start, end, count]);
      } else {
        ctrl.resultMessage = Messages.NO_RESULTS_LABEL;
      }
      ctrl.showDiscoverContainer = ctrl.context !== QueryActions.ADVANCED;
      ctrl.jump = jump;
      ctrl.field = field;
      ctrl.count = count;
      ctrl.items = results;
      ctrl.ready = true;

    };

    /**
     * Pager updates, including the initial page load.
     * @param results  new items to add to list.
     * @param count  total number of items.
     * @param field  the field queried.
     */
    ctrl.onPagerUpdate = function (results, count, field) {


      addResults(results);
      ctrl.field = field;
      ctrl.count = count;
      var off = QueryManager.getOffset();
      off++;
      var end = off + endIncrement;
      if (end > count) {
        end = count;
      }
      var start = AppContext.getViewStartIndex() + 1;
      ctrl.resultMessage = _format(Messages.RESULTS_LABEL, [start, end, count]);
      ctrl.ready = true;


    };

    ctrl.onPreviousUpdate = function (results, count, field) {

      addPreviousResults(results);
      ctrl.field = field;
      ctrl.count = count;
      var end;
      if (ctrl.nextPagerOffset <= AppContext.getItemsCount()) {
        end = ctrl.nextPagerOffset;
      } else {
        end = AppContext.getItemsCount();
      }
      var start = AppContext.getViewStartIndex() + 1;
      ctrl.resultMessage = _format(Messages.RESULTS_LABEL, [start, end, count]);
      ctrl.ready = true;

    };

    ctrl.resetListView = function () {
      ctrl.ready = false;
      ctrl.items = [];

    };

    ctrl.setQueryType = function (type) {
      ctrl.qt = type;
    };

    ctrl.setSortOrder = function (sort) {
      ctrl.sort = sort;
    };


    ctrl.$onInit = function () {

      ctrl.ready = true;

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

      if (ctrl.context === QueryActions.SEARCH) {
        ctrl.showOptions = false;
      }

      if (typeof qs.filter !== 'undefined') {
        if (qs.filter === 'none') {
          ctrl.jump = false;
        } else {
          ctrl.jump = true;
        }
      }

      var checkOffset;
      if (typeof qs.offset !== 'undefined') {
        checkOffset = parseInt(qs.offset);
      } else {
        checkOffset = 0;
      }

      /* Set the pager and backPager offsets on init.  These are both
       * children of the item-list-component.  Their values should be based
       * on increments or decrements of the initial offset.
       */
      ctrl.setNextPagerOffset(checkOffset + AppContext.getSetSize());

      if (checkOffset !== 0) {
        ctrl.setPrevPagerOffset(checkOffset - AppContext.getSetSize());
      } else {
        ctrl.setPrevPagerOffset(-1);
      }


    };

  }


  dspaceComponents.component('itemListComponent', {

    bindings: {
      context: '@'
    },

    templateUrl: '/ds/shared/templates/lists/itemList.html',
    controller: ItemListCtrl

  });

})();


