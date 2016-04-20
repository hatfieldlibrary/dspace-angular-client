/**
 * Created by mspalti on 3/1/16.
 */

/**
 * Retrieve first 10 items for the collection or community.
 * This query is only used by collections in our current
 * DSpace design.
 */
dspaceServices.factory('SolrQuery', ['$resource',
  function ($resource) {
    return $resource('/solrQuery');
  }
]);

dspaceServices.factory('SolrBrowseQuery', ['$resource',
  function ($resource) {
    return $resource('/solrQuery/:type/:id/:qType/:field/:sort/:terms/:offset/:rows', {}, {
      query: {method: 'GET', isArray: false}
    });
  }]);

dspaceServices.factory('SolrJumpToQuery', ['$resource',
  function ($resource) {
    return $resource('/solrJumpToQuery');
  }]);


// dspaceServices.factory('SolrDiscoveryQuery', ['$resource',
//   function ($resource) {
//     return $resource('/solrQuery/:type/:id/:terms', {}, {
//       query: {method: 'GET', isArray: false}
//     });
//   }]);
