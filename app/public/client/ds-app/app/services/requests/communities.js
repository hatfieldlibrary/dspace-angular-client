'use strict';

/**
 * Retrieves communities.
 */
dspaceServices.factory('GetCommunities', ['$resource', 'AppContext',
  function ($resource, AppContext) {
    return $resource('/' + AppContext.getApplicationPrefix() + '-api/getCommunities', {}, {
      query: {method: 'GET', isArray: true}
    });
  }
]);

/**
 * Retrieves communities without setting the session url.
 * Use this service when making a background request that
 * you do not want added to the session.
 */
dspaceServices.factory('GetCommunitiesForDiscover', ['$resource', 'AppContext',
  function ($resource, AppContext) {
    return $resource('/' + AppContext.getApplicationPrefix() + '-api/communitiesForDiscover', {}, {
      query: {method: 'GET', isArray: true}
    });
  }
]);

/**
 * Retrieves list of collections for community.
 */
dspaceServices.factory('GetCollectionsForCommunity', ['$resource', 'AppContext',
  function ($resource, AppContext) {
    return $resource('/' + AppContext.getApplicationPrefix() + '-api/collectionsForCommunity/:id', {}, {
      query: {method: 'GET', isArray: true}
    });
  }
]);
