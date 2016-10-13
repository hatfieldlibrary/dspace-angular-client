(function() {

  'use strict';

  /**
   * Retrieve first 10 items for the collection or community.
   * This query is only used by collections in our current
   * DSpace design.
   */
  dspaceRequests.factory('SolrQuery',
    function ($resource, AppContext) {
      return $resource('/' + AppContext.getApplicationPrefix() + '-api/solrQuery');
    }
  );

  dspaceRequests.factory('SolrBrowseQuery',
    function ($resource, AppContext) {
      return $resource('/' + AppContext.getApplicationPrefix() + '-api/solrQuery/:type/:id/:qType/:field/:sort/:terms/:offset/:rows', {}, {
        query: {method: 'GET', isArray: false}
      });
    });

  dspaceRequests.factory('SolrJumpToQuery',
    function ($resource, AppContext) {
      return $resource('/' + AppContext.getApplicationPrefix() + '-api/solrJumpToQuery');
    });

  /**
   * Sort options query
   */
  dspaceRequests.factory('SolrSortOptionsQuery',
    function($resource, AppContext) {
      return $resource('/' + AppContext.getApplicationPrefix() + '-api/solrQuery/:field/:mode');
    });


// dspaceServices.factory('SolrDiscoveryQuery', ['$resource',
//   function ($resource) {
//     return $resource('/solrQuery/:type/:id/:terms', {}, {
//       query: {method: 'GET', isArray: false}
//     });
//   }]);

})();

