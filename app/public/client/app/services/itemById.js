/**
 * Created by mspalti on 3/30/16.
 */

/**
 * Retrieves information about object via it's handle.
 */
dspaceServices.factory('ItemById', ['$resource',
  function ($resource) {
    return $resource('getItem/:item', {}, {
      query: {method: 'GET', isArray: false}
    });
  }
]);
