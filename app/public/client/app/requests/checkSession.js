'use strict';

/**
 * Middleware checks and validates DSpace session.
 */
dspaceServices.factory('CheckSession', ['$resource',
  function ($resource) {
    return $resource('/check-session', {}, {
      query: {method: 'GET', isArray: false}
    });
  }
]);
