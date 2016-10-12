'use strict';


/**
 * Retrieves information about object via it's handle.
 */
dspaceServices.factory('ItemByHandle', ['$resource', 'AppContext',
  function ($resource, AppContext) {
    return $resource('/' + AppContext.getApplicationPrefix() + '-api/handleRequest/:site/:item', {}, {
      query: {method: 'GET', isArray: false}
    });
  }
]);
