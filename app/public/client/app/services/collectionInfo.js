/**
 * Created by mspalti on 4/13/16.
 */


dspaceServices.factory('GetCollectionInfo', ['$resource',
  function ($resource) {
    return $resource('/collectionInfo/:item', {}, {
      query: {method: 'GET', isArray: false}
    });
  }
]);
