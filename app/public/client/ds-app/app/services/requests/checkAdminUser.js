/**
 * Created by mspalti on 5/12/16.
 */

(function () {

  'use strict';

  dspaceRequests.factory('CheckSysAdmin',
    function ($resource, AppContext) {
      return $resource('/' + AppContext.getApplicationPrefix() + '-api/adminStatus', {}, {
        query: {method: 'GET', isArray: false}
      });
    }
  );

})();
