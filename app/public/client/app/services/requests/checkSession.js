'use strict';

/**
 * Middleware checks and validates DSpace session.
 */
dspaceServices.factory('CheckSession', ['$resource',
  function ($resource) {
    return $resource('/rest/check-session', {}, {
      query: {method: 'GET', isArray: false}
    });
  }
]);
