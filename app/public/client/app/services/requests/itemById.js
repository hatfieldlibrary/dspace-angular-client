'use strict';

/**
 * Retrieves information about object via it's handle.
 */
dspaceServices.factory('ItemById', ['$resource',
  function ($resource) {
    return $resource('/rest/getItem/:item', {}, {
      query: {method: 'GET', isArray: false}
    });
  }
]);
