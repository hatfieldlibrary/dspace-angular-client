/**
 * Created by mspalti on 3/23/16.
 */

'use strict';

(function () {

  function HeaderCtrl(AppContext, $window, $mdMedia) {

    var ctrl = this;

    var open = false;

    ctrl.isSmallScreen = $mdMedia('sm') || $mdMedia('xs');
    
    ctrl.homeLogo = AppContext.getHomeLogo();

    ctrl.openMenu = function () {
      open = !open;
      AppContext.setMenu(open);
    };

    ctrl.goToHome = function() {
      $window.location.href = AppContext.getHomeLink();
    };

  }


  dspaceComponents.component('headerComponent', {

    bindings: {
      department: '@',
      collection: '@',
      type: '@',
      id: '@'
    },
    templateUrl: '/ds/shared/templates/header.html',
    controller: HeaderCtrl

  });


})();
