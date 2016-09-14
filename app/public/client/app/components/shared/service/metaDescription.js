/**
 * Created by mspalti on 9/14/16.
 */

'use strict';

(function()  {

  dspaceServices.service('PageDescription', function($rootScope){
    return {
      setDescription: function(description){
        $rootScope.pageDescription = description;
      }
    };
  });


})();
