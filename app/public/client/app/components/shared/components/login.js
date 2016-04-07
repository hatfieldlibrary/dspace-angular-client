/**
 * Created by mspalti on 2/23/16.
 */


(function () {

  function LoginCtrl($scope,
                     Login,
                     Utils,
                     AppContext) {

    var ctrl = this;

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

    templateUrl: '/shared/templates/login.html',
    controller: LoginCtrl

  });




})();
