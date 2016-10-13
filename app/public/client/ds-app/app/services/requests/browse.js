(function() {

  'use strict';

  /**
   * Retrieves information about object via it's handle.
   */
  dspaceRequests.factory('InlineBrowseRequest',
    function ($resource, AppContext) {
      return $resource('/' + AppContext.getApplicationPrefix() + '-api/solrQuery/:type/:id/:qType/:field/:sort/:terms/:offset/:rows', {}, {
        query: {method: 'GET', isArray: false}
      });
    }
  );

})();

