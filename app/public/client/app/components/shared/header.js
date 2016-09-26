/**
 * Created by mspalti on 3/23/16.
 */

'use strict';

(function () {

  function HeaderCtrl(Messages, MenuObserver, $window, $mdMedia) {

    var ctrl = this;

    var open = false;

    ctrl.isSmallScreen = $mdMedia('sm') || $mdMedia('xs');

    ctrl.homeLogo = Messages.HOME_LOGO;

    ctrl.openMenu = function () {
      open = !open;
      // Update the menu observable.
      MenuObserver.set(open);

    };

    ctrl.goToHome = function() {
      $window.location.href = Messages.HOME_LINK;
    };

  }

  dspaceComponents.component('headerComponent', {

    bindings: {
      department: '@',
      collection: '@',
      type: '@',
      id: '@'
    },
    templateUrl: '/ds/shared/header.html',
    controller: HeaderCtrl

  });


})();
