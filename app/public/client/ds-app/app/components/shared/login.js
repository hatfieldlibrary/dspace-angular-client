/**
 * Created by mspalti on 2/23/16.
 */

(function () {

  'use strict';

  function LoginCtrl(Utils,
                     Messages,
                     AppContext,
                     SessionObserver) {

    var ctrl = this;


    ctrl.loginLabel = Messages.LOGIN_LABEL;

    ctrl.logoutLabel = Messages.LOGOUT_LABEL;

    ctrl.sessionStatus = SessionObserver.get();

    /** Watch for change in DSpace session status. */
    var subscription = SessionObserver.subscribe(function (state) {
      ctrl.sessionStatus = state;
    });

    ctrl.getLoginUrl = function() {
      return '/' + AppContext.getApplicationPrefix() + '-api/auth/login';
    };

    ctrl.getLogoutUrl = function() {
      return '/' + AppContext.getApplicationPrefix() + '-api/logout';
    };




    ctrl.$onDestroy = function () {
      subscription.dispose();
    };

    /** Check DSpace session status on init. */
    ctrl.$onInit = function () {
      Utils.setSessionStatus();

    };

  }

  dspaceComponents.component('loginComponent', {

    bindings: {
      /**
       * Used to indicate button type.
       * @type {boolean}
       */
      raised: '<'
    },
    templateUrl: ['AppContext', function (AppContext) {
      return '/' + AppContext.getApplicationPrefix() + '-app/app/templates/shared/login.html';
    }],
    controller: LoginCtrl

  });


})();
