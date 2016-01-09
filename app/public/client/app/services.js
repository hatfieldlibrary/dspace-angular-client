'use strict';

var dspaceServices = angular.module('dspaceServices', ['ngResource']);

(function () {

  'use strict';

  /**
   * Retrieves information about object via it's handle.
   */
  dspaceServices.factory('ItemByHandle', ['$resource', 'restHost',
    function ($resource, restHost) {
      return $resource('handle/:site/:item', {}, {
        query: {method: 'GET', isArray: false}
      });
    }
  ]);

  dspaceServices.factory('Login', ['$resource',
    function ($resource) {
      return $resource('/auth/google', {}, {
        query: {method: 'GET', isArray: false}
      });
    }
  ]);


  dspaceServices.factory('CheckSession', ['$resource',
    function ($resource) {
      return $resource('/check-session', {}, {
        query: {method: 'GET', isArray: false}
      });
    }
  ]);

})();


