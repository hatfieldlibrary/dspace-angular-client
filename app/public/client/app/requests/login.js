'use strict';

/**
 * Google OAUTH2 login service.
 */
dspaceServices.factory('Login', ['$resource',
  function ($resource) {
    return $resource('/auth/google', {}, {
      query: {method: 'GET', isArray: false}
    });
  }
]);