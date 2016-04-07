/**
 * Created by mspalti on 4/4/16.
 */

/**
 * Retrieves information about object via it's handle.
 */
dspaceServices.factory('InlineBrowseRequest', ['$resource',
  function ($resource) {
    return $resource('solrQuery/:type/:id/:qType/:field/:terms/:offset/:rows', {}, {
      query: {method: 'GET', isArray: false}
    });
  }
]);
