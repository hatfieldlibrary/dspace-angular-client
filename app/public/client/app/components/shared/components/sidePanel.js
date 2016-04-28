/**
 * Created by mspalti on 2/23/16.
 */


function SideNavCtrl($scope,
                     $window,
                     $mdSidenav,
                     Messages,
                     AppContext) {

  var ctrl = this;

  ctrl.allCommunitiesLink = Messages.VIEW_ALL_COMMUNITIES;

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
   * Build handler to open/close a SideNav.
   */
  function buildToggler(navID) {
    $mdSidenav(navID)
      .toggle()
      .then(function () {

      });
  }

}


dspaceComponents.component('sideNavComponent', {

  bindings: {
    type: '@'
  },
  templateUrl: '/shared/templates/sidePanel.html',
  controller: SideNavCtrl

});
