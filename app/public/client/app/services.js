'use strict';

var dspaceServices = angular.module('dspaceServices', ['ngResource']);

(function () {

  'use strict';

  /**
   * Retrieves information about object via it's handle.
   */
  dspaceServices.factory('ItemByHandle', ['$resource', 'restHost',
    function ($resource, restHost) {
      return $resource(restHost + 'handle/:site/:item', {}, {
        query: {method: 'GET', isArray: false}
      });
    }
  ]);


})();


