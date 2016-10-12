'use strict';

/**
 * Middleware checks and validates DSpace session.
 */
dspaceServices.factory('CheckSession', ['$resource', 'AppContext',
  function ($resource, AppContext) {
    return $resource('/' + AppContext.getApplicationPrefix() + '-api/check-session', {}, {
      query: {method: 'GET', isArray: false}
    });
  }
]);
