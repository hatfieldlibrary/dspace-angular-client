(function() {

  'use strict';

  dspaceRequests.factory('GetCollectionInfo',
    function ($resource, AppContext) {
      return $resource('/' + AppContext.getApplicationPrefix() + '-api/collectionInfo/:item', {}, {
        query: {method: 'GET', isArray: false}
      });
    }
  );

})();

