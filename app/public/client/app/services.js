'use strict';

var dspaceServices = angular.module('dspaceServices', ['ngResource']);

(function () {

  'use strict';

  /**
   * Retrieves information about object via it's handle.
   */
  dspaceServices.factory('ItemByHandle', ['$resource',
    function ($resource) {
      return $resource('handle/:site/:item', {}, {
        query: {method: 'GET', isArray: false}
      });
    }
  ]);

  /**
   * Google OAUTH2 login service.
   */
  dspaceServices.factory('Login', ['$resource',
    function ($resource) {
      return $resource('/auth/google', {}, {
        query: {method: 'GET', isArray: false}
      });
    }
  ]);


  /**
   * Call middleware service that checks and validates DSpace session.
   */
  dspaceServices.factory('CheckSession', ['$resource',
    function ($resource) {
      return $resource('/check-session', {}, {
        query: {method: 'GET', isArray: false}
      });
    }
  ]);



})();


