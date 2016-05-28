/**
 * Created by mspalti on 3/4/16.
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

  function DiscoverDetailCtrl($scope,
                              $mdMedia,
                              $location,
                              ItemDialogFactory) {

    var ctrl = this;

    if (ctrl.description !== undefined) {
      ctrl.description[0] += ' ... ';
    }

    ctrl.itemLabel = '';

    if (ctrl.resourceType === '3') {
      ctrl.itemLabel = '(Collection Link)';
    } else if (ctrl.resourceType === '4') {
      ctrl.itemLabel = '(Department Link)';
    }



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
    ctrl.showItem = function (ev, id, type) {

      // item
      if (type === '2') {
        ItemDialogFactory.showItem(ev, id, $scope.customFullscreen);
      }
      // community or collection
      else {
        $location.path('/handle/' + ctrl.handle);

      }

    };

  }

  dspaceComponents.component('discoverDetailComponent', {

    bindings: {
      title: '@',
      defaultTitle: '@',
      id: '@',
      description: '<',
      count: '@',
      resourceType: '@',
      handle: '@',
      last: '<'
    },
    templateUrl: '/ds/shared/templates/lists/discoverDetail.html',
    controller: DiscoverDetailCtrl

  });

})();
