(function() {

  'use strict';

  /**
   * Retrieves information about object via it's handle.
   */
  dspaceRequests.factory('ItemById',
    function ($resource, AppContext) {
      return $resource('/' + AppContext.getApplicationPrefix() + '-api/getItem/:item', {}, {
        query: {method: 'GET', isArray: false}
      });
    }
  );

})();

