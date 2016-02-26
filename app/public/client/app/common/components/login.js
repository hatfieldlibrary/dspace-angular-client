/**
 * Created by mspalti on 2/23/16.
 */


(function () {

  function LoginCtrl($scope,
                     Login,
                     CheckSession,
                     Data) {

    var ctrl = this;

    ctrl.sessionStatus = Data.hasDspaceSession;

    ctrl.login = function () {
      Login.query();

    };

    var init = function () {

      var sessionStatus = CheckSession.query();

      sessionStatus.$promise
        .then(function () {
          if (sessionStatus.status === 'ok') {
            Data.hasDspaceSession = true;
          } else {
            Data.hasDspaceSession = false;
          }
        });

    };

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
