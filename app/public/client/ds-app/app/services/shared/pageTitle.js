/**
 * Created by mspalti on 7/12/16.
 */

(function()  {

  'use strict';

  dspaceServices.service('PageTitle', function($rootScope){
    return {
      setTitle: function(title){
        $rootScope.title = title;
      }
    };
  });

})();
