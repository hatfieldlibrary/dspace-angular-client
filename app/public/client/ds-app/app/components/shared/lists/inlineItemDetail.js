/**
 * Inline item component. Embed in e.g.: subject and author components.
 * Show actions are not registered with the router and are not part of browser
 * history.
 * Created by mspalti on 2/23/16.
 */

(function () {

  'use strict';

  /**
   * Controller.
   * @param $scope
   * @param $mdMedia
   * @param AppContext
   * @param ItemDialogFactory
   * @constructor
   */
  function ItemDetailController($scope,
                                $mdMedia,
                                AppContext,
                                ItemDialogFactory) {

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

        AppContext.isNewSet(false);

        ItemDialogFactory.showItem(ev, id, $scope.customFullscreen);

    };

  }

  dspaceComponents.component('inlineItemDetailComponent', {

    bindings: {
      title: '@',
      author: '<',
      publisher: '@',
      year: '@',
      handle: '@',
      id: '@',
      pos: '@',
      type: '@',
      last: '<',
      abstract: '@'

    },
    controller: ItemDetailController,
    templateUrl: ['AppContext', function (AppContext) {
      return '/' + AppContext.getApplicationPrefix() + '-app/app/templates/shared/lists/inlineItemDetail.html';
    }]
  });

})();

