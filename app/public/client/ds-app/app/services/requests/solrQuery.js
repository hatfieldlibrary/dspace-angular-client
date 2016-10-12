'use strict';

/**
 * Retrieve first 10 items for the collection or community.
 * This query is only used by collections in our current
 * DSpace design.
 */
dspaceServices.factory('SolrQuery', ['$resource', 'AppContext',
  function ($resource, AppContext) {
    return $resource('/' + AppContext.getApplicationPrefix() + '-api/solrQuery');
  }
]);

dspaceServices.factory('SolrBrowseQuery', ['$resource',  'AppContext',
  function ($resource, AppContext) {
    return $resource('/' + AppContext.getApplicationPrefix() + '-api/solrQuery/:type/:id/:qType/:field/:sort/:terms/:offset/:rows', {}, {
      query: {method: 'GET', isArray: false}
    });
  }]);

dspaceServices.factory('SolrJumpToQuery', ['$resource', 'AppContext',
  function ($resource, AppContext) {
    return $resource('/' + AppContext.getApplicationPrefix() + '-api/solrJumpToQuery');
  }]);

/**
 * Sort options query
 */
dspaceServices.factory('SolrSortOptionsQuery', '$resource', 'AppContext',
  function($resource, AppContext) {
    return $resource('/' + AppContext.getApplicationPrefix() + '-api/solrQuery/:field/:mode');
  });


// dspaceServices.factory('SolrDiscoveryQuery', ['$resource',
//   function ($resource) {
//     return $resource('/solrQuery/:type/:id/:terms', {}, {
//       query: {method: 'GET', isArray: false}
//     });
//   }]);
