/**
 * Created by mspalti on 2/23/16.
 */

(function () {


  function DialogCtrl($mdDialog, data) {

    var ctrl = this;

    ctrl.data = data;

    ctrl.cancel = function() {
      $mdDialog.cancel();
    };

  }


  function ItemDetailController($scope, $mdMedia, $mdDialog) {

    var ctrl = this;

    ctrl.showItem = function (ev, id) {

      var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;

      $mdDialog.show(
        {
          controller: DialogCtrl,
          controllerAs: '$ctrl',
          templateUrl:  '/shared/templates/lists/dialogItem.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose: true,
          fullscreen: useFullScreen,
          bindToController: true,
          resolve: {
            ItemById: 'ItemById',
            data: function(ItemById) {
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
