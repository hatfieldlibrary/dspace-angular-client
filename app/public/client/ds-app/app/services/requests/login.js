(function() {

  'use strict';

  /**
   * Google OAUTH2 login service.
   */
  dspaceRequests.factory('Login',
    function ($resource, AppContext) {
      return $resource('/' + AppContext.getApplicationPrefix() + '-api/auth/google', {}, {
        query: {method: 'GET', isArray: false}
      });
    }
  );

})();

