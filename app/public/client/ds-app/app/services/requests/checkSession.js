
(function() {

  'use strict';

  /**
   * Middleware checks and validates DSpace session.
   */
  dspaceRequests.factory('CheckSession',
    function ($resource, AppContext) {
      return $resource('/' + AppContext.getApplicationPrefix() + '-api/check-session', {}, {
        query: {method: 'GET', isArray: false}
      });
    }
  );

})();



