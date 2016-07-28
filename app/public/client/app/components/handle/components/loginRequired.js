/**
 * Component for the login required message.
 * Created by mspalti on 4/21/16.
 */

'use strict';

(function () {

  function LoginRequiredCtrl(Messages, AppContext) {

    var ctrl = this;

    ctrl.administrator = Messages.ADMINISTRATOR_CONTACT;

    ctrl.administratorEmail = Messages.ADMINISTRATOR_EMAIL;

    ctrl.errorMessage = Messages.UNABLE_TO_ACCESS_CONTENT;
    
    ctrl.showLogin = AppContext.useRedirect();

  }

  dspaceComponents.component('loginRequiredComponent', {

    templateUrl: '/ds/handle/templates/loginRequired.html',
    controller: LoginRequiredCtrl

  });

})();
