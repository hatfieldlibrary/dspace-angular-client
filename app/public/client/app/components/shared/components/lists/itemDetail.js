/**
 * Created by mspalti on 2/23/16.
 */

'use strict';

(function () {
  
  /**
   * The dialog controller.
   * @param $mdDialog
   * @param $timeout
   * @param $anchorScroll
   * @param data
   * @constructor
   */
  function DialogCtrl($mdDialog,
                      $timeout,
                      $anchorScroll,
                      data) {

    var ctrl = this;

    /**
     * The item data to show.
     */
    ctrl.data = data;

    /**
     * Controls whether or not metadata is shown in the view.
     * @type {boolean}
     */
    ctrl.showMetadata = false;

    /**
     * Closes the dialog.
     */
    ctrl.cancel = function () {
      $mdDialog.cancel();
    };

    /**
     * Toggles the metadata view.
     */
    ctrl.toggleMeta = function () {

      // Add a brief timeout before scrolling to
      // position.
      $timeout(function () {

        if (ctrl.showMetadata == true) {
          $anchorScroll('metadata');
        } else {
          $anchorScroll('dialog-top');

        }
      }, 100);

      // Toggle
      ctrl.showMetadata = !ctrl.showMetadata;

    };


  }
  
  /**
   * The component controller.
   * @param $scope
   * @param $mdMedia
   * @param $mdDialog
   * @constructor
   */
  function ItemDetailController($scope, $mdMedia, $mdDialog) {

    var ctrl = this;

    /**
     * Shows the $mdDialog.
     * @param ev the event
     * @param id the DSpace id of the item
     */
    ctrl.showItem = function (ev, id) {

      var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;

      $mdDialog.show(
        {
          controller: DialogCtrl,
          controllerAs: '$ctrl',
          templateUrl: '/shared/templates/lists/dialogItem.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose: true,
          fullscreen: useFullScreen,
          bindToController: true,
          // do not show dialog until promise returns
          resolve: {
            ItemById: 'ItemById',
            data: function (ItemById) {
              return ItemById.query({item: id})
            }
          }
        });

    };

    /**
     * Sets fullscreen view via media query.
     */
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
