/**
 * Created by mspalti on 2/23/16.
 */
'use strict';

(function () {

  function LoginCtrl($scope,
                     Login,
                     Utils,
                     Messages,
                     AppContext) {

    var ctrl = this;

    /**
     * Used to indicate button type.
     * @type {boolean}
     */
    ctrl.raised = false;

    ctrl.loginLabel = Messages.LOGIN_LABEL;

    ctrl.logoutLabel = Messages.LOGOUT_LABEL;

    ctrl.sessionStatus = AppContext.hasDspaceSession;

    /** Login request */
    ctrl.login = function () {
      Login.query();

    };

    /** Check DSpace session status on init. */
    var init = function () {

      Utils.checkSession();

    };
    /** Watch for change in DSpace session status. */
    $scope.$watch(function () {
        return AppContext.hasDspaceSession;
      },

      function (newValue, oldValue) {
        if (newValue !== oldValue) {
          ctrl.sessionStatus = newValue;
        }
      });

    init();

  }

  dspaceComponents.component('loginComponent', {

    bindings: {
      raised: '<'
    },
    templateUrl: '/shared/templates/login.html',
    controller: LoginCtrl

  });


})();
