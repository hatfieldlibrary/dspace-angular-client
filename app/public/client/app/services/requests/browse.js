
'use strict';

/**
 * Retrieves information about object via it's handle.
 */
dspaceServices.factory('InlineBrowseRequest', ['$resource',
  function ($resource) {
    return $resource('/ds/solrQuery/:type/:id/:qType/:field/:sort/:terms/:offset/:rows', {}, {
      query: {method: 'GET', isArray: false}
    });
  }
]);
