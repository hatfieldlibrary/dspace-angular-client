'use strict';

/**
 * Retrieve first 10 items for the collection or community.
 * This query is only used by collections in our current
 * DSpace design.
 */
dspaceServices.factory('SolrQuery', ['$resource',
  function ($resource) {
    return $resource('/rest/solrQuery');
  }
]);

dspaceServices.factory('SolrBrowseQuery', ['$resource',
  function ($resource) {
    return $resource('/rest/solrQuery/:type/:id/:qType/:field/:sort/:terms/:offset/:rows', {}, {
      query: {method: 'GET', isArray: false}
    });
  }]);

dspaceServices.factory('SolrJumpToQuery', ['$resource',
  function ($resource) {
    return $resource('/rest/solrJumpToQuery');
  }]);

/**
 * Sort options query
 */
dspaceServices.factory('SolrSortOptionsQuery', '$resource',
  function($resource) {
    return $resource('/rest/solrQuery/:field/:mode');
  });


// dspaceServices.factory('SolrDiscoveryQuery', ['$resource',
//   function ($resource) {
//     return $resource('/solrQuery/:type/:id/:terms', {}, {
//       query: {method: 'GET', isArray: false}
//     });
//   }]);
