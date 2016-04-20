/**
 * Created by mspalti on 2/25/16.
 */
/**
 * Retrieves information about object via it's handle.
 */
dspaceServices.factory('GetCommunities', ['$resource',
  function ($resource) {
    return $resource('/getCommunities', {}, {
      query: {method: 'GET', isArray: true}
    });
  }
]);

/**
 * Retrieves list of collections for community.
 */
dspaceServices.factory('GetCollectionsForCommunity', ['$resource',
  function ($resource) {
    return $resource('/collectionsForCommunity/:id', {}, {
      query: {method: 'GET', isArray: true}
    });
  }
]);
