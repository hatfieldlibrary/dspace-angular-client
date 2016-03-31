/**
 * Created by mspalti on 2/23/16.
 */

(function () {

  function ItemListCtrl(QueryManager) {

    var ctrl = this;

    ctrl.items = [];

    ctrl.type = QueryManager.getAssetType();
    ctrl.id = QueryManager.getAssetId();

    ctrl.onUpdate = function (results, count, field) {

      ctrl.items = results;
      ctrl.count = count;
      ctrl.field = field;


    };

    ctrl.onPagerUpdate = function (results, count, position, field) {

      //results.unshift({})
      addResults(results);
      ctrl.count = count;

      ctrl.field = field;
      console.log(field)

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


