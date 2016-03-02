/**
 * Created by mspalti on 2/23/16.
 */

(function () {

  function ItemListCtrl() {

    var ctrl = this;

    ctrl.onUpdate = function (results, count, resultFormat) {
      console.log(resultFormat);
      console.log(count);
      console.log(results);
      ctrl.resultFormat = resultFormat;
      ctrl.items = results;
      ctrl. count = count;

    };

  }


  dspaceComponents.component('itemListComponent', {

    templateUrl: '/handle/templates/itemList.html',
    controller: ItemListCtrl

  });

})();


