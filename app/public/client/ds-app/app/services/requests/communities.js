(function() {

  'use strict';

  /**
   * Retrieves communities.
   */
  dspaceRequests.factory('GetCommunities',
    function ($resource, AppContext) {
      return $resource('/' + AppContext.getApplicationPrefix() + '-api/getCommunities', {}, {
        query: {method: 'GET', isArray: true}
      });
    }
  );

  /**
   * Retrieves communities without setting the session url.
   * Use this service when making a background request that
   * you do not want added to the session.
   */
  dspaceRequests.factory('GetCommunitiesForDiscover',
    function ($resource, AppContext) {
      return $resource('/' + AppContext.getApplicationPrefix() + '-api/communitiesForDiscover', {}, {
        query: {method: 'GET', isArray: true}
      });
    }
  );

  /**
   * Retrieves list of collections for community.
   */
  dspaceRequests.factory('GetCollectionsForCommunity',
    function ($resource, AppContext) {
      return $resource('/' + AppContext.getApplicationPrefix() + '-api/collectionsForCommunity/:id', {}, {
        query: {method: 'GET', isArray: true}
      });
    }
  );

})();

