/**
 * Created by mspalti on 3/23/16.
 */

'use strict';

(function () {

  function HeaderCtrl(AppContext, AppConfig, $window, $mdMedia) {

    var ctrl = this;

    var open = false;

    ctrl.isSmallScreen = $mdMedia('sm') || $mdMedia('xs');

    ctrl.openMenu = function () {

      open = !open;
      AppContext.setMenu(open);
    };

    ctrl.goToHome = function() {
      $window.location.href = AppConfig.HOME_LINK;
    };

  }


  dspaceComponents.component('headerComponent', {

    bindings: {
      department: '@',
      collection: '@',
      type: '@',
      id: '@'
    },
    templateUrl: '/shared/templates/header.html',
    controller: HeaderCtrl

  });


})();
