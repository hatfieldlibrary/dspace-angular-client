'use strict';

dspaceServices.factory('GetCollectionInfo', ['$resource',
  function ($resource) {
    return $resource('/collectionInfo/:item', {}, {
      query: {method: 'GET', isArray: false}
    });
  }
]);
