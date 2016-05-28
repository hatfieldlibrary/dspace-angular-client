'use strict';

dspaceServices.factory('GetCollectionInfo', ['$resource',
  function ($resource) {
    return $resource('/ds/collectionInfo/:item', {}, {
      query: {method: 'GET', isArray: false}
    });
  }
]);
