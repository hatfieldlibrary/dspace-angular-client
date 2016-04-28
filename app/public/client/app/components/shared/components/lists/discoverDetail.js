/**
 * Created by mspalti on 3/4/16.
 */
'use strict';

(function() {

  /**
   * Component controller.
   * @param $scope
   * @param $mdMedia
   * @param ItemDialogFactory
   * @constructor
     */
  
  function DiscoverDetailCtrl($scope, $mdMedia, ItemDialogFactory) {
    
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

  dspaceComponents.component('discoverDetailComponent', {

    bindings: {
      title: '@',
      defaultTitle: '@',
      id: '@',
      description: '<',
      count: '@',
      last: '<'
    },
    templateUrl: '/shared/templates/lists/discoverDetail.html',
    controller: DiscoverDetailCtrl
  })

})();
