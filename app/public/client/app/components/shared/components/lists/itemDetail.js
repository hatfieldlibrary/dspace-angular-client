/**
 * Created by mspalti on 2/23/16.
 */

(function () {


  function DialogCtrl($scope, result) {
    $scope.data = result;

  }

  function ItemDetailController($scope, $mdMedia, $mdDialog) {

    var ctrl = this;

    ctrl.showItem = function (ev, id) {

      var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;


      $mdDialog.show(
        {
          controller: DialogCtrl,
          template: '<md-dialog>' +
          '             <dialog-item-component data=data></dialog-item-component>' +
          '           </md-dialog>',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose: true,
          fullscreen: useFullScreen,
          resolve: {
            ItemById: 'ItemById',
            result: function(ItemById) {
              return ItemById.query({item: id})
            }
          }


        });

    };

    $scope.$watch(function () {
      return $mdMedia('xs') || $mdMedia('sm');
    }, function (wantsFullScreen) {
      $scope.customFullscreen = (wantsFullScreen === true);
    });


  }


  dspaceComponents.component('itemDetailComponent', {

    bindings: {
      title: '@',
      author: '<',
      publisher: '@',
      year: '@',
      handle: '@',
      id: '@'

    },
    controller: ItemDetailController,
    templateUrl: '/shared/templates/lists/itemDetail.html'

  });

})();
