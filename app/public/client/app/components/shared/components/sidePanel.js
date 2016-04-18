/**
 * Created by mspalti on 2/23/16.
 */


function SideNavCtrl($scope, $window, $mdSidenav, AppContext) {

  var ctrl = this;

  $scope.$watch(function () {
      return AppContext.getMenuState()
    },
    function updateMenu(newValue, oldValue) {
      if (newValue !== oldValue) {
        buildToggler('right');
      }
    });

  ctrl.greaterThanMd = function () {
    return $window.innerWidth >= 1200;
  };

  ctrl.close = function () {

    $mdSidenav('right').close()
      .then(function () {

      });

  };


  /**
   * Build handler to open/close a SideNav; when animation finishes
   * report completion in console
   */
  function buildToggler(navID) {
    $mdSidenav(navID)
      .toggle()
      .then(function () {
        // $log.debug("toggle " + navID + " is done");
      });
  }

}


dspaceComponents.component('sideNavComponent', {

  bindings: {
    type: '@'
  },
  templateUrl: '/shared/templates/sidenav.html',
  controller: SideNavCtrl

});
