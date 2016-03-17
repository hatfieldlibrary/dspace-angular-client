/**
 * Created by mspalti on 2/23/16.
 */

(function () {

  function ItemListCtrl() {

    var ctrl = this;

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


