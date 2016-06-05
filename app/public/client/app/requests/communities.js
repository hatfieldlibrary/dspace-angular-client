'use strict';

/**
 * Retrieves communities.
 */
dspaceServices.factory('GetCommunities', ['$resource',
  function ($resource) {
    return $resource('/ds/getCommunities', {}, {
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
    return $resource('/ds/communitiesForDiscover', {}, {
      query: {method: 'GET', isArray: true}
    });
  }
]);

/**
 * Retrieves list of collections for community.
 */
dspaceServices.factory('GetCollectionsForCommunity', ['$resource',
  function ($resource) {
    return $resource('/ds/collectionsForCommunity/:id', {}, {
      query: {method: 'GET', isArray: true}
    });
  }
]);
