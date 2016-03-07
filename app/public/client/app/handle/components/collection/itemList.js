/**
 * Created by mspalti on 2/23/16.
 */

(function () {

  function ItemListCtrl() {

    var ctrl = this;

    ctrl.action = 'list';


    ctrl.onUpdate = function (results, count, field) {

      ctrl.field = field;
      ctrl.items = results;
      ctrl. count = count;


    };

  }


  dspaceComponents.component('itemListComponent', {

    bindings: {
      type: '@',
      id: '@'
    },
    templateUrl: '/handle/templates/itemList.html',
    controller: ItemListCtrl

  });

})();


