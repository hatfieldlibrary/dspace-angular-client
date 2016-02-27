/**
 * Created by mspalti on 2/23/16.
 */

(function () {

  function ItemListCtrl() {

    var ctrl = this;

    ctrl.onUpdate = function (data) {
      console.log(data);
      ctrl.items = data.results;

    };

  }


  dspaceComponents.component('itemListComponent', {

    templateUrl: '/handle/templates/itemList.html',
    controller: ItemListCtrl

  });

})();


