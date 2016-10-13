/**
 * Created by mspalti on 9/14/16.
 */

(function()  {

  'use strict';

  dspaceServices.service('PageDescription', function($rootScope){
    return {
      setDescription: function(description){
        $rootScope.pageDescription = description;
      }
    };
  });

})();
