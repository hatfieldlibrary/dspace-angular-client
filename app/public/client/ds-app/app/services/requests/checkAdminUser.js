/**
 * Created by mspalti on 5/12/16.
 */

'use strict';

dspaceServices.factory('CheckSysAdmin', ['$resource','AppContext',
  function ($resource, AppContext) {
    return $resource('/' + AppContext.getApplicationPrefix() + '-api/adminStatus', {}, {
      query: {method: 'GET', isArray: false}
    });
  }
]);
