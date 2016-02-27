/**
 * Created by mspalti on 2/23/16.
 */


(function () {

  function LoginCtrl($scope,
                     Login,
                     Utils,
                     Data) {

    var ctrl = this;

    ctrl.sessionStatus = Data.hasDspaceSession;

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
        return Data.hasDspaceSession;
      },

      function (newValue, oldValue) {
        if (newValue !== oldValue) {
          ctrl.sessionStatus = newValue;
        }
      });

    init();

  }

  dspaceComponents.component('loginComponent', {

    template: '<div> <p> <a ng-if="$ctrl.sessionStatus" href="/logout" target="_top">Logout</a> <a ng-if="!$ctrl.sessionStatus" href="auth/google" target="_top">Login</a> </p> </div>',
    controller: LoginCtrl

  });




})();
