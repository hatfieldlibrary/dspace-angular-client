'use strict';

dspaceServices.factory('GetCollectionInfo', ['$resource',
  function ($resource) {
    return $resource('/rest/collectionInfo/:item', {}, {
      query: {method: 'GET', isArray: false}
    });
  }
]);
