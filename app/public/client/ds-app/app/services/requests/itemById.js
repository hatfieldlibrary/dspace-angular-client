'use strict';

/**
 * Retrieves information about object via it's handle.
 */
dspaceServices.factory('ItemById', ['$resource', 'AppContext',
  function ($resource, AppContext) {
    return $resource('/' + AppContext.getApplicationPrefix() + '-api/getItem/:item', {}, {
      query: {method: 'GET', isArray: false}
    });
  }
]);
