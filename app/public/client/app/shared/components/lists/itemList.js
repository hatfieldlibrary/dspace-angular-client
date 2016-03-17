/**
 * Created by mspalti on 2/23/16.
 */

(function () {

  function ItemListCtrl(QueryManager) {

    var ctrl = this;

    ctrl.type = QueryManager.getAssetType();
    ctrl.id = QueryManager.getAssetId();

    ctrl.onUpdate = function (results, count, field) {

      ctrl.items = results;
      ctrl.count = count;
      ctrl.field = field;


    };

  }


  dspaceComponents.component('itemListComponent', {

    templateUrl: '/shared/templates/lists/itemList.html',
    controller: ItemListCtrl

  });

})();


