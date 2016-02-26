/**
 * Created by mspalti on 2/23/16.
 */

/**
 * Retrieve first 10 items for the collection or community.
 * This query is only used by collections in our current
 * DSpace design.
 */
dspaceServices.factory('SolrQueryByType', ['$resource',
  function ($resource) {
    return $resource('/solrByType/:type/:id/:offset', {}, {
      query: {method: 'GET', isArray: false}
    });
  }
]);
