/**
 * Created by mspalti on 5/12/16.
 */

dspaceServices.factory('CheckSysAdmin', ['$resource',
  function ($resource) {
    return $resource('/ds/adminStatus', {}, {
      query: {method: 'GET', isArray: false}
    });
  }
]);
