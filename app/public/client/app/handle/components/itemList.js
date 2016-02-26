/**
 * Created by mspalti on 2/23/16.
 */

(function () {

  function ItemListCtrl($scope, Data) {

    var ctrl = this;

    ctrl.onUpdate = function (data) {
      console.log(data);
      ctrl.items = data.results;

    };

    //$scope.$watch(
    //  function () {
    //    return Data.items;
    //  },
    //  function (data) {
    //    ctrl.items = data;
    //  }
    //);

  }


  dspaceComponents.component('itemList', {

    template: '<list-item-detail ng-repeat="col in $ctrl.items" title="{{col.title}}" author="col.author" publisher="{{col.publisher}}" year="{{col.year}}" handle="{{col.handle}}" id="{{col.id}}"></list-item-detail><pager-component on-update="$ctrl.onUpdate(data)"></pager-component>',
    controller: ItemListCtrl

  });

})();


