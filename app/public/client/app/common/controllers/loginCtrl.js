/**
 * Created by mspalti on 2/23/16.
 */

(function() {

  dspaceControllers.controller('LoginCtrl', [
    '$scope',
    'Login',
    'CheckSession',
    'Data',
    function ($scope,
              Login,
              CheckSession,
              Data) {

      var vm = this;
      vm.sessionStatus = Data.hasDspaceSession;


      vm.login = function () {
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
            vm.sessionStatus = newValue;
          }
        });

      init();

    }

  ]);
})();
