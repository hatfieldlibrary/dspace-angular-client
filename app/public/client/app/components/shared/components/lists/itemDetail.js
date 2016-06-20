/**
 * Created by mspalti on 2/23/16.
 */

'use strict';

(function () {

  /**
   * Component controller.
   * @param $scope
   * @param $mdMedia
   * @param ItemDialogFactory
   * @constructor
   */
  function ItemDetailController($scope, $mdMedia, ItemDialogFactory) {

    var ctrl = this;

    /**
     * Sets fullscreen view via media query.
     */
    $scope.$watch(function () {
      return $mdMedia('xs') || $mdMedia('sm');
    }, function (wantsFullScreen) {
      $scope.customFullscreen = wantsFullScreen;
    });

    /**
     * Shows the dialog.
     * @param ev the event
     * @param id the DSpace id of the item
     */
    ctrl.showItem = function (ev, id) {

      ItemDialogFactory.showItem(ev, id, $scope.customFullscreen);

    };

  }


  dspaceComponents.component('itemDetailComponent', {

    bindings: {
      title: '@',
      author: '<',
      publisher: '@',
      year: '@',
      handle: '@',
      id: '@',
      last: '<',
      abstract: '@'

    },
    controller: ItemDetailController,
    templateUrl: '/ds/shared/templates/lists/itemDetail.html'

  });

})();
