'use strict';


/**
 * Retrieves information about object via it's handle.
 */
dspaceServices.factory('ItemByHandle', ['$resource',
  function ($resource) {
    return $resource('handleRequest/:site/:item', {}, {
      query: {method: 'GET', isArray: false}
    });
  }
]);