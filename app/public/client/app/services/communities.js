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
