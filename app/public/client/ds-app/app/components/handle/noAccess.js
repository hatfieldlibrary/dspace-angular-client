
(function () {

  'use strict';

  function NoAccessCtrl(Messages, AppContext) {

    var ctrl = this;

    ctrl.administrator = Messages.ADMINISTRATOR_CONTACT;

    ctrl.administratorEmail = Messages.ADMINISTRATOR_EMAIL;

    ctrl.errorMessage = Messages.UNABLE_TO_ACCESS_CONTENT;

    ctrl.showLogin = AppContext.useRedirect();

  }

  dspaceComponents.component('noAccessComponent', {

    templateUrl: ['AppContext', function (AppContext) {
      return '/' + AppContext.getApplicationPrefix() + '-app/app/templates/handle/noAccess.html';
    }],
    controller: NoAccessCtrl

  });

})();
