'use strict';

dspaceServices.factory('GetCollectionInfo', ['$resource', 'AppContext',
  function ($resource, AppContext) {
    return $resource('/' + AppContext.getApplicationPrefix() + '-api/collectionInfo/:item', {}, {
      query: {method: 'GET', isArray: false}
    });
  }
]);
