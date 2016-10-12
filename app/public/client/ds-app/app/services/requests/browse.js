
'use strict';

/**
 * Retrieves information about object via it's handle.
 */
dspaceServices.factory('InlineBrowseRequest', ['$resource', 'AppContext',
  function ($resource, AppContext) {
    return $resource('/' + AppContext.getApplicationPrefix() + '-api/solrQuery/:type/:id/:qType/:field/:sort/:terms/:offset/:rows', {}, {
      query: {method: 'GET', isArray: false}
    });
  }
]);
