
(function () {

  'use strict';

  function NoAccessCtrl(Messages, AppContext) {

    var ctrl = this;

    ctrl.administrator = Messages.ADMINISTRATOR_CONTACT;

    ctrl.administratorEmail = Messages.ADMINISTRATOR_EMAIL;

    ctrl.errorMessage = Messages.UNAUTHORIZED_FOR_ACCESS;

    ctrl.showLogin = AppContext.useRedirect();

  }

  dspaceComponents.component('unauthorizedComponent', {

    templateUrl: ['AppContext', function (AppContext) {
      return '/' + AppContext.getApplicationPrefix() + '-app/app/templates/shared/unauthorized.html';
    }],
    controller: NoAccessCtrl

  });

})();
