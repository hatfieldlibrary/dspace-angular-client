'use strict';

/**
 * Google OAUTH2 login service.
 */
dspaceServices.factory('Login', ['$resource','AppContext',
  function ($resource, AppContext) {
    return $resource('/' + AppContext.getApplicationPrefix() + '-api/auth/google', {}, {
      query: {method: 'GET', isArray: false}
    });
  }
]);
