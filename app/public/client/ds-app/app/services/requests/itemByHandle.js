(function() {

  'use strict';

  /**
   * Retrieves information about object via it's handle.
   */
  dspaceRequests.factory('ItemByHandle',
    function ($resource, AppContext) {
      return $resource('/' + AppContext.getApplicationPrefix() + '-api/handleRequest/:site/:item', {}, {
        query: {method: 'GET', isArray: false}
      });
    }
  );

})();

