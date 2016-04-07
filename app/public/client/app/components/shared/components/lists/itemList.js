/**
 * Created by mspalti on 2/23/16.
 */

'use strict';

(function () {

  function ItemListCtrl(QueryManager, AppContext) {

    var ctrl = this;

    /**
     * The array containing the items to present in the view.
     * @type {Array}
     */
    ctrl.items = [];

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
     * Updates controller values with results after pager update. Pager is
     * responsible for initializing with new data, including the initial
     * data on page load.
     * @param results  items in result
     * @param count  total number of items
     * @param field   the field queried
     */
    ctrl.onUpdate = function (results, count, field) {

      ctrl.items = results;
      ctrl.count = count;
      ctrl.field = field;

    };

    /**
     * Updates controller after pager request for more items.
     * @param results  new items to add to list.
     * @param count  total number of items.
     * @param field  the field queried.
     */
    ctrl.onPagerUpdate = function (results, count,  field) {
      addResults(results);
      ctrl.count = count;
      ctrl.field = field;

    };

    /**
     * Adds new results to current items.
     * @param results  items returned by paging query.
       */
    function addResults(results) {
      ctrl.items = ctrl.items.concat(results);

    }

  }


  dspaceComponents.component('itemListComponent', {

    bindings: {
      context: '@'
    },

    templateUrl: '/shared/templates/lists/itemList.html',
    controller: ItemListCtrl

  });

})();


