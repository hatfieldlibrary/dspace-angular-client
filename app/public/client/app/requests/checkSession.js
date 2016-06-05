'use strict';

/**
 * Middleware checks and validates DSpace session.
 */
dspaceServices.factory('CheckSession', ['$resource',
  function ($resource) {
    return $resource('/ds/check-session', {}, {
      query: {method: 'GET', isArray: false}
    });
  }
]);
