/**
 * Created by mspalti on 2/23/16.
 */


function SideNavCtrl($scope, $window, $mdSidenav, AppContext) {

  var ctrl = this;

  $scope.$watch(function(){return AppContext.getMenuState()},
    function updateMenu(newValue, oldValue) {
      if (newValue !== oldValue) {
        buildDelayedToggler('right');
      }
    });

  ctrl.greaterThanMd = function() {
    return $window.innerWidth >= 1200;
  };

  ctrl.close = function() {

      $mdSidenav('right').close()
        .then(function () {

        });

  };

  /**
   * Supplies a function that will continue to operate until the
   * time is up.
   */
  function debounce(func, wait, context) {
    var timer;

    return function debounced() {
      var context = $scope,
        args = Array.prototype.slice.call(arguments);
      $timeout.cancel(timer);
      timer = $timeout(function () {
        timer = undefined;
        func.apply(context, args);
      }, wait || 10);
    };
  };


  /**
   * Build handler to open/close a SideNav; when animation finishes
   * report completion in console
   */
  function buildDelayedToggler(navID) {
    console.log(navID)
   // return debounce(function () {
      $mdSidenav(navID)
        .toggle()
        .then(function () {
         // $log.debug("toggle " + navID + " is done");
        });
   // }, 200);
  }

}


dspaceComponents.component('sideNavComponent', {

  templateUrl: '/shared/templates/sidenav.html',
  controller: SideNavCtrl

});
