/**
 * Created by mspalti on 2/23/16.
 */

(function () {

  function ItemListCtrl(QueryManager) {

    var ctrl = this;

    ctrl.items = [];

    ctrl.selectedIndex = -1;

    ctrl.type = QueryManager.getAssetType();
    ctrl.id = QueryManager.getAssetId();

    ctrl.setSelected = function(index) {
      ctrl.selectedIndex = index;
      QueryManager.setCurrentIndex(index);

    };

    ctrl.onUpdate = function (results, count, field) {
      ctrl.items = results;
      ctrl.count = count;
      ctrl.field = field;


    };

    ctrl.onPagerUpdate = function (results, count, position, field) {

      addResults(results);
      ctrl.count = count;
      ctrl.field = field;

    };

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


