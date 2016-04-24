/**
 * Created by mspalti on 2/25/16.
 */
/**
 * Retrieves communities.
 */
dspaceServices.factory('GetCommunities', ['$resource',
  function ($resource) {
    return $resource('/getCommunities', {}, {
      query: {method: 'GET', isArray: true}
    });
  }
]);

/**
 * Retrieves communities without setting the session url.
 * Use this service when making a background request that
 * you do not want added to the session.
 */
dspaceServices.factory('GetCommunitiesForDiscover', ['$resource',
  function ($resource) {
    return $resource('/communitiesForDiscover', {}, {
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
